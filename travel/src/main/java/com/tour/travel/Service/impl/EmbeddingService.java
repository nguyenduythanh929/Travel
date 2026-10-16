package com.tour.travel.Service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tour.travel.Configurations.GeminiApiConfig;
import com.tour.travel.Entity.LocationEntity;
import com.tour.travel.Entity.TourEntity;
import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmbeddingService {

    private final GeminiApiConfig geminiApiConfig;
    private final ObjectMapper objectMapper;
    private final OkHttpClient httpClient = new OkHttpClient();

    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
    private static final String EMBEDDING_MODEL = "text-embedding-004";

    public List<Double> generateTourEmbedding(TourEntity tour) throws IOException {
        String tourText = buildTourText(tour);
        return generateEmbedding(tourText);
    }

    public List<Double> generateQueryEmbedding(String query) throws IOException {
        return generateEmbedding(query);
    }

    private String buildTourText(TourEntity tour) {
        StringBuilder text = new StringBuilder();

        text.append(tour.getName()).append(". ");

        if (tour.getTrailer() != null && !tour.getTrailer().isEmpty()) {
            text.append(tour.getTrailer()).append(". ");
        }

        if (tour.getTourType() != null) {
            text.append("Loại tour: ").append(tour.getTourType().getName()).append(". ");
        }

        if (tour.getLocations() != null && !tour.getLocations().isEmpty()) {
            String locations = tour.getLocations().stream()
                .map(LocationEntity::getName)
                .collect(Collectors.joining(", "));
            text.append("Địa điểm: ").append(locations).append(". ");
        }

        text.append("Thời gian: ").append(tour.getDuration()).append(" ngày. ");
        text.append("Phương tiện: ").append(tour.getTransport()).append(". ");
        text.append("Giá người lớn: ").append(tour.getPriceAdult()).append(" VND. ");

        if (tour.getTourDetail() != null && !tour.getTourDetail().isEmpty()) {
            String cleanDetail = tour.getTourDetail().replaceAll("<[^>]*>", " ");
            text.append(cleanDetail, 0, Math.min(cleanDetail.length(), 500));
        }

        return text.toString();
    }

    private List<Double> generateEmbedding(String text) throws IOException {
        ObjectNode requestBody = objectMapper.createObjectNode();

        ObjectNode content = objectMapper.createObjectNode();
        ArrayNode parts = objectMapper.createArrayNode();
        ObjectNode part = objectMapper.createObjectNode();
        part.put("text", text);
        parts.add(part);
        content.set("parts", parts);

        requestBody.set("content", content);

        RequestBody body = RequestBody.create(requestBody.toString(), JSON);

        String url = geminiApiConfig.getApiUrl() + EMBEDDING_MODEL + ":embedContent?key=" + geminiApiConfig.getApiKey();

        Request request = new Request.Builder()
            .url(url)
            .header("content-type", "application/json")
            .post(body)
            .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "No error details";
                throw new IOException("Failed to generate embedding: " + response.code() + " - " + errorBody);
            }

            assert response.body() != null;
            String responseBody = response.body().string();
            JsonNode jsonResponse = objectMapper.readTree(responseBody);

            if (jsonResponse.has("embedding") && jsonResponse.get("embedding").has("values")) {
                JsonNode values = jsonResponse.get("embedding").get("values");
                List<Double> embedding = new ArrayList<>();
                for (JsonNode value : values) {
                    embedding.add(value.asDouble());
                }
                return embedding;
            }

            throw new IOException("Invalid embedding response format");
        }
    }

    public double cosineSimilarity(List<Double> embedding1, List<Double> embedding2) {
        if (embedding1.size() != embedding2.size()) {
            throw new IllegalArgumentException("Embeddings must have the same dimensions");
        }

        double dotProduct = 0.0;
        double norm1 = 0.0;
        double norm2 = 0.0;

        for (int i = 0; i < embedding1.size(); i++) {
            dotProduct += embedding1.get(i) * embedding2.get(i);
            norm1 += embedding1.get(i) * embedding1.get(i);
            norm2 += embedding2.get(i) * embedding2.get(i);
        }

        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }

    public List<Double> parseEmbedding(String embeddingJson) throws IOException {
        if (embeddingJson == null || embeddingJson.isEmpty()) {
            return null;
        }
        JsonNode jsonNode = objectMapper.readTree(embeddingJson);
        List<Double> embedding = new ArrayList<>();
        for (JsonNode value : jsonNode) {
            embedding.add(value.asDouble());
        }
        return embedding;
    }

    public String embeddingToJson(List<Double> embedding) throws IOException {
        return objectMapper.writeValueAsString(embedding);
    }
}
