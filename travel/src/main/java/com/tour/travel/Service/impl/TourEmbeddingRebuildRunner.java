package com.tour.travel.Service.impl;

import com.tour.travel.Entity.TourEntity;
import com.tour.travel.Repository.TourRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
@Profile("rebuild-embeddings")
@RequiredArgsConstructor
public class TourEmbeddingRebuildRunner implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(TourEmbeddingRebuildRunner.class);
    private static final int BATCH_SIZE = 50;

    private final TourRepository tourRepository;
    private final EmbeddingService embeddingService;

    @Override
    public void run(ApplicationArguments args) {
        int pageNumber = 0;
        int updatedCount = 0;
        Page<TourEntity> page;
        do {
            page = tourRepository.findAll(PageRequest.of(pageNumber, BATCH_SIZE, Sort.by("id").ascending()));
            for (TourEntity tour : page.getContent()) {
                try {
                    List<Double> embedding = embeddingService.generateTourEmbedding(tour);
                    tour.setEmbedding(embeddingService.embeddingToJson(embedding));
                } catch (IOException e) {
                    logger.error("Embedding rebuild failed for tour {}. Existing data is unchanged for this tour.",
                        tour.getId());
                    throw new IllegalStateException(
                        "Embedding rebuild failed for tour " + tour.getId()
                            + "; fix the reported API or data issue and rerun the rebuild profile.",
                        e
                    );
                }
                tourRepository.save(tour);
                updatedCount++;
            }
            logger.info("Rebuilt embeddings for {} of {} tours.", updatedCount, page.getTotalElements());
            pageNumber++;
        } while (page.hasNext());
        logger.info("Tour embedding rebuild complete. Updated {} tours.", updatedCount);
    }
}
