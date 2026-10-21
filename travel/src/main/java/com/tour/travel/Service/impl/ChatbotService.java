package com.tour.travel.Service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tour.travel.Configurations.GeminiApiConfig;
import com.tour.travel.Converter.TourConverter;
import com.tour.travel.Entity.ChatConversationEntity;
import com.tour.travel.Entity.LocationEntity;
import com.tour.travel.Entity.TourEntity;
import com.tour.travel.dto.request.chatbot.ChatbotRequest;
import com.tour.travel.dto.request.tour.TourFilterRequest;
import com.tour.travel.dto.response.chatbot.ChatbotResponse;
import com.tour.travel.dto.response.tour.TourResponse;
import com.tour.travel.Repository.ChatConversationRepository;
import com.tour.travel.Repository.TourRepository;
import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final GeminiApiConfig geminiApiConfig;
    private final TourRepository tourRepository;
    private final TourConverter tourConverter;
    private final ChatConversationRepository conversationRepository;
    private final EmbeddingService embeddingService;
    private final ObjectMapper objectMapper;
    private final OkHttpClient httpClient = new OkHttpClient();

    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
    private static final int TOP_K_TOURS = 5;

    public ChatbotResponse chat(ChatbotRequest request) throws IOException {
        String sessionId = request.getSessionId();
        if (sessionId == null || sessionId.isEmpty()) {
            sessionId = UUID.randomUUID().toString();
        }

        List<ChatConversationEntity> conversationHistory =
            conversationRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);

        List<TourEntity> relevantTours = findRelevantTours(request.getMessage());

        String systemPrompt = buildSystemPrompt(relevantTours);
        String geminiResponse = callGeminiAPI(request.getMessage(), conversationHistory, systemPrompt);

        List<Integer> recommendedTourIds = extractTourIds(geminiResponse);
        List<TourResponse> recommendedTours = recommendedTourIds.stream()
            .map(id -> tourRepository.findById(id).orElse(null))
            .filter(Objects::nonNull)
            .map(tourConverter::toResponse)
            .collect(Collectors.toList());

        ChatConversationEntity conversation = new ChatConversationEntity();
        conversation.setSessionId(sessionId);
        conversation.setUserId(request.getUserId());
        conversation.setUserMessage(request.getMessage());
        conversation.setBotResponse(geminiResponse);
        conversation.setRecommendedTourIds(
            recommendedTourIds.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(","))
        );
        conversationRepository.save(conversation);

        return ChatbotResponse.builder()
            .message(cleanResponse(geminiResponse))
            .sessionId(sessionId)
            .recommendedTours(recommendedTours)
            .build();
    }

    private String buildSystemPrompt(List<TourEntity> tours) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are a professional travel advisor for a tour booking company. ");
        prompt.append("Your role is to recommend the best tours based on user preferences such as budget, destination, duration, and interests.\n\n");
        prompt.append("Here are the available tours:\n\n");

        for (TourEntity tour : tours) {
            prompt.append(String.format(
                    """
                            Tour ID: %d
                            Name: %s
                            Price Adult: %.0f VND
                            Price Child: %.0f VND
                            Duration: %d days
                            Transport: %s
                            Locations: %s
                            Tour Type: %s
                            Description: %s

                            """,
                tour.getId(),
                tour.getName(),
                tour.getPriceAdult(),
                tour.getPriceChild(),
                tour.getDuration(),
                tour.getTransport(),
                tour.getLocations() != null ?
                    tour.getLocations().stream()
                        .map(LocationEntity::getName)
                        .collect(Collectors.joining(", ")) : "N/A",
                tour.getTourType() != null ? tour.getTourType().getName() : "N/A",
                tour.getTrailer() != null ? tour.getTrailer() : ""
            ));
        }

        prompt.append("\nInstructions:\n");
        prompt.append("1. Understand the user's preferences (budget, destination, duration, interests)\n");
        prompt.append("2. Recommend 1-3 tours that best match their needs\n");
        prompt.append("3. Explain why each tour is a good fit\n");
        prompt.append("4. Be conversational, friendly, and helpful\n");
        prompt.append("5. When recommending tours, include the Tour ID in format [TOUR_ID:X] where X is the tour ID number\n");
        prompt.append("6. If the user asks general questions about travel, provide helpful advice\n");
        prompt.append("7. Always respond in Vietnamese if the user writes in Vietnamese, otherwise in English\n");

        return prompt.toString();
    }

    private String callGeminiAPI(String userMessage, List<ChatConversationEntity> history, String systemPrompt) throws IOException {
        StringBuilder conversationText = new StringBuilder();
        conversationText.append(systemPrompt).append("\n\n");
        for (ChatConversationEntity conv : history) {
            conversationText.append("User: ").append(conv.getUserMessage()).append("\n");
            conversationText.append("Assistant: ").append(conv.getBotResponse()).append("\n\n");
        }
        conversationText.append("User: ").append(userMessage).append("\n");
        conversationText.append("Assistant: ");
        ObjectNode requestBody = objectMapper.createObjectNode();

        ArrayNode contents = objectMapper.createArrayNode();
        ObjectNode content = objectMapper.createObjectNode();

        ArrayNode parts = objectMapper.createArrayNode();
        ObjectNode part = objectMapper.createObjectNode();
        part.put("text", conversationText.toString());
        parts.add(part);

        content.set("parts", parts);
        contents.add(content);

        requestBody.set("contents", contents);
        ObjectNode generationConfig = objectMapper.createObjectNode();
        generationConfig.put("temperature", 0.7);
        generationConfig.put("maxOutputTokens", 2048);
        requestBody.set("generationConfig", generationConfig);

        RequestBody body = RequestBody.create(requestBody.toString(), JSON);
        String url = geminiApiConfig.getApiUrl() + geminiApiConfig.getModel() + geminiApiConfig.getApiKey();

        Request request = new Request.Builder()
            .url(url)
            .header("content-type", "application/json")
            .post(body)
            .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "No error details";
                throw new IOException("Unexpected response from Gemini API: " + response.code() + " - " + errorBody);
            }

            assert response.body() != null;
            String responseBody = response.body().string();
            JsonNode jsonResponse = objectMapper.readTree(responseBody);

            if (jsonResponse.has("candidates") && jsonResponse.get("candidates").isArray()) {
                JsonNode candidates = jsonResponse.get("candidates");
                if (!candidates.isEmpty()) {
                    JsonNode firstCandidate = candidates.get(0);
                    if (firstCandidate.has("content")) {
                        JsonNode content2 = firstCandidate.get("content");
                        if (content2.has("parts") && content2.get("parts").isArray()) {
                            JsonNode parts2 = content2.get("parts");
                            if (!parts2.isEmpty() && parts2.get(0).has("text")) {
                                return parts2.get(0).get("text").asText();
                            }
                        }
                    }
                }
            }

            return "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.";
        }
    }

    private List<TourEntity> findRelevantTours(String query) throws IOException {
        List<Double> queryEmbedding = embeddingService.generateQueryEmbedding(query);

        TourFilterRequest filterRequest = new TourFilterRequest();
        filterRequest.setStatus(1);
        PageRequest pageRequest = PageRequest.of(0, 1000, Sort.by("createdAt").descending());
        List<TourEntity> allTours = tourRepository.searchTours(filterRequest, pageRequest).getContent();

        List<TourEntity> toursWithEmbeddings = allTours.stream()
            .filter(tour -> tour.getEmbedding() != null && !tour.getEmbedding().isEmpty())
            .toList();

        if (toursWithEmbeddings.isEmpty()) {
            return allTours.stream().limit(TOP_K_TOURS).collect(Collectors.toList());
        }

        List<TourSimilarity> similarities = new ArrayList<>();
        for (TourEntity tour : toursWithEmbeddings) {
            try {
                List<Double> tourEmbedding = embeddingService.parseEmbedding(tour.getEmbedding());
                double similarity = embeddingService.cosineSimilarity(queryEmbedding, tourEmbedding);
                similarities.add(new TourSimilarity(tour, similarity));
            } catch (Exception e) {
                System.err.println("Error parsing embedding for tour " + tour.getId() + ": " + e.getMessage());
            }
        }

        return similarities.stream()
            .sorted((a, b) -> Double.compare(b.similarity, a.similarity))
            .limit(TOP_K_TOURS)
            .map(ts -> ts.tour)
            .collect(Collectors.toList());
    }

    private static class TourSimilarity {
        TourEntity tour;
        double similarity;

        TourSimilarity(TourEntity tour, double similarity) {
            this.tour = tour;
            this.similarity = similarity;
        }
    }

    private List<Integer> extractTourIds(String response) {
        List<Integer> tourIds = new ArrayList<>();
        String pattern = "\\[TOUR_ID:(\\d+)]";
        java.util.regex.Pattern r = java.util.regex.Pattern.compile(pattern);
        java.util.regex.Matcher m = r.matcher(response);

        while (m.find()) {
            try {
                tourIds.add(Integer.parseInt(m.group(1)));
            } catch (NumberFormatException e) {
                // Skip invalid tour IDs
            }
        }

        return tourIds;
    }

    private String cleanResponse(String response) {
        return response.replaceAll("\\[TOUR_ID:\\d+]", "").trim();
    }

    public List<ChatConversationEntity> getConversationHistory(String sessionId) {
        return conversationRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
    }

    public List<ChatConversationEntity> getUserConversations(Integer userId) {
        return conversationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
