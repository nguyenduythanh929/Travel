package com.tour.travel.Service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class EmbeddingServiceTest {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final EmbeddingService embeddingService = new EmbeddingService(null, objectMapper);

    @Test
    void requestsConsistentDimensionsAndRetrievalTaskTypes() {
        ObjectNode queryRequest = EmbeddingService.buildEmbeddingRequestBody(
            "beach vacation",
            "RETRIEVAL_QUERY",
            objectMapper
        );
        ObjectNode tourRequest = EmbeddingService.buildEmbeddingRequestBody(
            "Coastal tour",
            "RETRIEVAL_DOCUMENT",
            objectMapper
        );

        assertEquals(EmbeddingService.EMBEDDING_DIMENSIONS, queryRequest.path("outputDimensionality").asInt());
        assertEquals("RETRIEVAL_QUERY", queryRequest.path("taskType").asText());
        assertEquals(EmbeddingService.EMBEDDING_DIMENSIONS, tourRequest.path("outputDimensionality").asInt());
        assertEquals("RETRIEVAL_DOCUMENT", tourRequest.path("taskType").asText());
    }

    @Test
    void rejectsStoredEmbeddingsWithUnexpectedDimensionsOrValues() throws IOException {
        String validEmbedding = objectMapper.writeValueAsString(new ArrayList<>(
            java.util.Collections.nCopies(EmbeddingService.EMBEDDING_DIMENSIONS, 0.25)
        ));
        assertEquals(EmbeddingService.EMBEDDING_DIMENSIONS, embeddingService.parseEmbedding(validEmbedding).size());
        assertThrows(IOException.class, () -> embeddingService.parseEmbedding("[1,2,3]"));
        assertThrows(IOException.class, () -> embeddingService.parseEmbedding("{\"values\":[]}"));
        assertThrows(IOException.class, () -> embeddingService.parseEmbedding(null));

        List<Double> malformed = new ArrayList<>(java.util.Collections.nCopies(
            EmbeddingService.EMBEDDING_DIMENSIONS,
            1.0
        ));
        malformed.set(5, Double.NaN);
        assertThrows(IOException.class, () -> embeddingService.embeddingToJson(malformed));
    }

    @Test
    void computesCosineSimilarityAndRejectsIncompatibleVectors() {
        List<Double> first = new ArrayList<>(java.util.Collections.nCopies(
            EmbeddingService.EMBEDDING_DIMENSIONS,
            0.0
        ));
        List<Double> second = new ArrayList<>(first);
        first.set(0, 1.0);
        second.set(0, 1.0);

        assertEquals(1.0, embeddingService.cosineSimilarity(first, second), 0.000001);
        assertThrows(IllegalArgumentException.class, () -> embeddingService.cosineSimilarity(first, List.of(1.0)));
        assertThrows(IllegalArgumentException.class, () -> embeddingService.cosineSimilarity(
            new ArrayList<>(java.util.Collections.nCopies(EmbeddingService.EMBEDDING_DIMENSIONS, 0.0)),
            second
        ));
    }
}
