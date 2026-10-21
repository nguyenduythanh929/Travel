package com.tour.travel.Service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tour.travel.Entity.TourEntity;
import com.tour.travel.Repository.TourRepository;
import com.tour.travel.dto.request.tour.TourFilterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

class ChatbotServiceSemanticSearchTest {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final EmbeddingService embeddingService = spy(new EmbeddingService(null, objectMapper));
    private final TourRepository tourRepository = mock(TourRepository.class);
    private final ChatbotService chatbotService = new ChatbotService(
        null,
        tourRepository,
        null,
        null,
        embeddingService,
        objectMapper
    );

    @Test
    void ranksCompatibleTourEmbeddingsAndSkipsMalformedData() throws IOException {
        List<Double> query = vector(0);
        TourEntity closest = tour(1, vector(0));
        TourEntity unrelated = tour(2, vector(1));
        TourEntity malformed = tour(3, null);
        malformed.setEmbedding("not-json");

        doReturn(query).when(embeddingService).generateQueryEmbedding("beach");
        when(tourRepository.searchTours(any(TourFilterRequest.class), any(Pageable.class)))
            .thenReturn(new PageImpl<>(List.of(unrelated, malformed, closest)));

        List<TourEntity> results = chatbotService.findRelevantTours("beach");

        assertEquals(List.of(closest, unrelated), results);
    }

    @Test
    void fallsBackToAvailableToursWhenNoUsableEmbeddingExists() throws IOException {
        TourEntity first = tour(1, null);
        TourEntity second = tour(2, null);
        doReturn(vector(0)).when(embeddingService).generateQueryEmbedding(anyString());
        when(tourRepository.searchTours(any(TourFilterRequest.class), any(Pageable.class)))
            .thenReturn(new PageImpl<>(List.of(first, second)));

        List<TourEntity> results = chatbotService.findRelevantTours("mountains");

        assertEquals(List.of(first, second), results);
    }

    private TourEntity tour(int id, List<Double> embedding) throws IOException {
        TourEntity tour = new TourEntity();
        tour.setId(id);
        if (embedding != null) {
            tour.setEmbedding(embeddingService.embeddingToJson(embedding));
        }
        return tour;
    }

    private List<Double> vector(int activeDimension) {
        List<Double> values = new ArrayList<>(Collections.nCopies(EmbeddingService.EMBEDDING_DIMENSIONS, 0.0));
        values.set(activeDimension, 1.0);
        return values;
    }
}
