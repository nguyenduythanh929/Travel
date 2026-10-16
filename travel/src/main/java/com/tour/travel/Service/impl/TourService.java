package com.tour.travel.Service.impl;

import com.tour.travel.Converter.TourConverter;
import com.tour.travel.Entity.TourEntity;
import com.tour.travel.Entity.TourImageEntity;
import com.tour.travel.Exceptions.DataNotFoundException;
import com.tour.travel.Exceptions.InvalidParamException;
import com.tour.travel.dto.request.tour.TourAdminRequest;
import com.tour.travel.dto.request.tour.TourFilterRequest;
import com.tour.travel.dto.request.tour.TourImageRequest;
import com.tour.travel.dto.response.tour.*;
import com.tour.travel.Repository.TourImageRepository;
import com.tour.travel.Repository.TourRepository;
import com.tour.travel.Repository.TourScheduleRepository;
import com.tour.travel.Service.ITourService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TourService implements ITourService {

    private final TourRepository tourRepository;
    private final TourConverter tourConverter;
    private final TourImageRepository tourImageRepository;
    private final TourScheduleRepository tourScheduleRepository;
    private final FileStorageService fileStorageService;
    private final EmbeddingService embeddingService;

    @Override
    public Page<TourResponse> getAllTours(TourFilterRequest request, PageRequest pageRequest) {
        return tourRepository.searchTours(request, pageRequest)
                .map(tourConverter::toResponse);
    }

    @Override
    public Page<TourResponse> searchToursByName(String keyword, PageRequest pageRequest) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return Page.empty(pageRequest);
        }
        return tourRepository.findByNameContainingIgnoreCase(keyword.trim(), pageRequest)
                .map(tourConverter::toResponse);
    }

    @Override
    public List<TourResponse> getTopToursByType(Integer parentId, Integer limit) {
        PageRequest pageRequest = PageRequest.of(0, limit, Sort.by("createdAt").descending());
        return tourRepository.findByTourType_ParentId(parentId, pageRequest)
                .map(tourConverter::toResponse)
                .getContent();
    }

    @Override
    public TourDetailResponse getTourDetail(int id) {
        TourEntity tour = tourRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Tour not found with id: " + id));

        TourDetailResponse response = tourConverter.toDetailResponse(tour);
        response.setSchedules(
                tourScheduleRepository.findByTour_IdOrderByIdAsc(tour.getId())
                        .stream()
                        .map(tourConverter::toScheduleResponse)
                        .toList()
        );
        return response;
    }

    @Override
    public TourAdminResponse getTourForAdmin(Integer id) {
        TourEntity tour = tourRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Tour not found with id: " + id));
        return tourConverter.toTourAdminResponse(tour);
    }

    @Override
    public TourAdminInitResponse getTourInitData() {
        return tourConverter.toTourAdminInitResponse();
    }

    @Override
    @Transactional
    public TourResponse createTour(TourAdminRequest request) {
        TourEntity tour = tourConverter.toEntity(null, request);
        TourEntity savedTour = tourRepository.save(tour);

        generateEmbedding(savedTour);

        return tourConverter.toResponse(savedTour);
    }

    @Override
    @Transactional
    public TourResponse updateTour(Integer id, TourAdminRequest request) {
        TourEntity tour = tourConverter.toEntity(id, request);
        TourEntity updatedTour = tourRepository.save(tour);

        generateEmbedding(updatedTour);

        return tourConverter.toResponse(updatedTour);
    }

    @Override
    @Transactional
    public void deleteTour(Integer id) {
        TourEntity tour = tourRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Tour not found with id: " + id));
        tour.setStatus(0);
        tourRepository.save(tour);
    }

    @Override
    @Transactional
    public TourImageResponse uploadTourImage(Integer tourId, TourImageRequest request) {
        TourEntity tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new DataNotFoundException("Tour not found with id: " + tourId));

        int currentImageCount = tourImageRepository.findByTour_Id(tourId).size();
        if (currentImageCount >= TourImageEntity.MAXIMUM_IMAGES_PER_TOUR) {
            throw new InvalidParamException("Maximum " + TourImageEntity.MAXIMUM_IMAGES_PER_TOUR + " images allowed per tour");
        }

        TourImageEntity image = TourImageEntity.builder()
                .tour(tour)
                .url(request.getImageUrl())
                .build();

        TourImageEntity savedImage = tourImageRepository.save(image);

        return TourImageResponse.builder()
                .id(savedImage.getId())
                .tourId(tourId)
                .imageUrl(savedImage.getUrl())
                .build();
    }

    @Override
    @Transactional
    public void deleteAllTourImages(Integer tourId) {
        List<TourImageEntity> images = tourImageRepository.findByTour_Id(tourId);
        for (TourImageEntity image : images) {
            fileStorageService.deleteFile(image.getUrl());
        }
        tourImageRepository.deleteByTour_Id(tourId);
    }

    @Override
    @Transactional
    public void updateTourAvatar(Integer tourId, String avatarUrl) {
        TourEntity tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new DataNotFoundException("Tour not found with id: " + tourId));
        tour.setAvatar(avatarUrl);
        tourRepository.save(tour);
    }

    private void generateEmbedding(TourEntity tour) {
        try {
            List<Double> embedding = embeddingService.generateTourEmbedding(tour);
            String embeddingJson = embeddingService.embeddingToJson(embedding);
            tour.setEmbedding(embeddingJson);
            tourRepository.save(tour);
        } catch (Exception e) {
            System.err.println("Failed to generate embedding for tour " + tour.getId() + ": " + e.getMessage());
        }
    }
}
