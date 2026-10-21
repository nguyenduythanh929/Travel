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
    static final String EMBEDDING_MODEL = "gemini-embedding-001";
    static final int EMBEDDING_DIMENSIONS = 768;

    public List<Double> generateTourEmbedding(TourEntity tour) throws IOException {
        String tourText = buildTourText(tour);
        return generateEmbedding(tourText, "RETRIEVAL_DOCUMENT");
    }

    public List<Double> generateQueryEmbedding(String query) throws IOException {
        return generateEmbedding(query, "RETRIEVAL_QUERY");
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

    private List<Double> generateEmbedding(String text, String taskType) throws IOException {
        String apiKey = geminiApiConfig.getApiKey();
        if (apiKey == null || apiKey.isBlank()) {
            throw new IOException("Gemini API key is not configured.");
        }

        ObjectNode requestBody = buildEmbeddingRequestBody(text, taskType, objectMapper);

        RequestBody body = RequestBody.create(requestBody.toString(), JSON);

        String url = geminiApiConfig.getApiUrl().replaceAll("/+$", "")
            + "/models/" + EMBEDDING_MODEL + ":embedContent";

        Request request = new Request.Builder()
            .url(url)
            .header("content-type", "application/json")
            .header("x-goog-api-key", apiKey)
            .post(body)
            .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Failed to generate embedding with model " + EMBEDDING_MODEL
                    + ": HTTP status " + response.code() + ".");
            }

            ResponseBody responseBody = response.body();
            if (responseBody == null) {
                throw new IOException("Embedding API returned an empty response.");
            }
            String responseText = responseBody.string();
            JsonNode jsonResponse = objectMapper.readTree(responseText);

            JsonNode values = jsonResponse.path("embedding").path("values");
            if (!values.isArray()) {
                throw new IOException("Embedding API returned an invalid response: expected an embedding values array.");
            }
            return parseEmbeddingValues(values);
        }
    }

    static ObjectNode buildEmbeddingRequestBody(String text, String taskType, ObjectMapper objectMapper) {
        ObjectNode requestBody = objectMapper.createObjectNode();
        ObjectNode content = objectMapper.createObjectNode();
        ArrayNode parts = objectMapper.createArrayNode();
        ObjectNode part = objectMapper.createObjectNode();
        part.put("text", text);
        parts.add(part);
        content.set("parts", parts);
        requestBody.set("content", content);
        requestBody.put("taskType", taskType);
        requestBody.put("outputDimensionality", EMBEDDING_DIMENSIONS);
        return requestBody;
    }

    public double cosineSimilarity(List<Double> embedding1, List<Double> embedding2) {
        validateEmbedding(embedding1);
        validateEmbedding(embedding2);
        if (embedding1.size() != embedding2.size()) {
            throw new IllegalArgumentException(
                "Embedding dimension mismatch: expected " + embedding1.size() + " values, received " + embedding2.size() + "."
            );
        }

        double dotProduct = 0.0;
        double norm1 = 0.0;
        double norm2 = 0.0;

        for (int i = 0; i < embedding1.size(); i++) {
            dotProduct += embedding1.get(i) * embedding2.get(i);
            norm1 += embedding1.get(i) * embedding1.get(i);
            norm2 += embedding2.get(i) * embedding2.get(i);
        }

        if (norm1 == 0.0 || norm2 == 0.0) {
            throw new IllegalArgumentException("Cannot calculate cosine similarity for a zero-magnitude embedding.");
        }
        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }

    public List<Double> parseEmbedding(String embeddingJson) throws IOException {
        if (embeddingJson == null || embeddingJson.isBlank()) {
            throw new IOException("Stored embedding is missing.");
        }
        JsonNode jsonNode = objectMapper.readTree(embeddingJson);
        if (!jsonNode.isArray()) {
            throw new IOException("Stored embedding must be a JSON array.");
        }
        if (jsonNode.size() != EMBEDDING_DIMENSIONS) {
            throw new IOException("Stored embedding has " + jsonNode.size() + " dimensions; expected "
                + EMBEDDING_DIMENSIONS + " for model " + EMBEDDING_MODEL + ".");
        }
        List<Double> embedding = new ArrayList<>();
        for (JsonNode value : jsonNode) {
            if (!value.isNumber() || !Double.isFinite(value.asDouble())) {
                throw new IOException("Stored embedding contains a non-numeric or non-finite value.");
            }
            embedding.add(value.asDouble());
        }
        return embedding;
    }

    public String embeddingToJson(List<Double> embedding) throws IOException {
        try {
            validateEmbedding(embedding);
        } catch (IllegalArgumentException e) {
            throw new IOException(e.getMessage(), e);
        }
        return objectMapper.writeValueAsString(embedding);
    }

    private static List<Double> parseEmbeddingValues(JsonNode values) throws IOException {
        if (values.size() != EMBEDDING_DIMENSIONS) {
            throw new IOException("Embedding model " + EMBEDDING_MODEL + " returned " + values.size()
                + " dimensions; expected " + EMBEDDING_DIMENSIONS + ".");
        }
        List<Double> embedding = new ArrayList<>(values.size());
        for (JsonNode value : values) {
            if (!value.isNumber() || !Double.isFinite(value.asDouble())) {
                throw new IOException("Embedding response contains a non-numeric or non-finite value.");
            }
            embedding.add(value.asDouble());
        }
        return embedding;
    }

    private static void validateEmbedding(List<Double> embedding) {
        if (embedding == null || embedding.size() != EMBEDDING_DIMENSIONS) {
            throw new IllegalArgumentException("Expected an embedding with " + EMBEDDING_DIMENSIONS + " dimensions.");
        }
        if (embedding.stream().anyMatch(value -> value == null || !Double.isFinite(value))) {
            throw new IllegalArgumentException("Embedding contains a non-numeric or non-finite value.");
        }
    }
}
