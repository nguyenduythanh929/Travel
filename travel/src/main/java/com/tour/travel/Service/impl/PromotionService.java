package com.tour.travel.Service.impl;

import com.tour.travel.Entity.PromotionEntity;
import com.tour.travel.Entity.TourEntity;
import com.tour.travel.Exceptions.DataNotFoundException;
import com.tour.travel.dto.request.promotion.PromotionRequest;
import com.tour.travel.dto.response.promotion.PromotionResponse;
import com.tour.travel.Repository.PromotionRepository;
import com.tour.travel.Repository.TourRepository;
import com.tour.travel.Service.IPromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromotionService implements IPromotionService {

    private final PromotionRepository promotionRepository;
    private final TourRepository tourRepository;

    @Override
    @Transactional
    public PromotionResponse createPromotion(PromotionRequest request) {
        PromotionEntity promotion = new PromotionEntity();
        mapRequestToEntity(request, promotion);

        PromotionEntity saved = promotionRepository.save(promotion);

        if (request.getTourIds() != null && !request.getTourIds().isEmpty()) {
            applyPromotionToTours(saved.getId(), request.getTourIds());
        }

        return convertToResponse(saved);
    }

    @Override
    @Transactional
    public PromotionResponse updatePromotion(Integer id, PromotionRequest request) {
        PromotionEntity promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy promotion với id = " + id));

        mapRequestToEntity(request, promotion);
        PromotionEntity updated = promotionRepository.save(promotion);

        return convertToResponse(updated);
    }

    @Override
    @Transactional
    public void deletePromotion(Integer id) {
        PromotionEntity promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy promotion với id = " + id));

        promotion.setStatus(0); // Soft delete
        promotionRepository.save(promotion);
    }

    @Override
    public PromotionResponse getPromotionById(Integer id) {
        PromotionEntity promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy promotion với id = " + id));

        return convertToResponse(promotion);
    }

    @Override
    public Page<PromotionResponse> getAllPromotions(Pageable pageable) {
        return promotionRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    @Override
    public List<PromotionResponse> getActivePromotions() {
        return promotionRepository.findAllActivePromotions(LocalDateTime.now())
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void applyPromotionToTours(Integer promotionId, List<Integer> tourIds) {
        PromotionEntity promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy promotion với id = " + promotionId));

        List<TourEntity> tours = tourRepository.findAllById(tourIds);

        for (TourEntity tour : tours) {
            if (!promotion.getTours().contains(tour)) {
                promotion.getTours().add(tour);
            }
        }

        promotionRepository.save(promotion);
    }

    @Override
    @Transactional
    public void removePromotionFromTours(Integer promotionId, List<Integer> tourIds) {
        PromotionEntity promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy promotion với id = " + promotionId));

        List<TourEntity> toursToRemove = tourRepository.findAllById(tourIds);
        promotion.getTours().removeAll(toursToRemove);

        promotionRepository.save(promotion);
    }

    @Override
    public PromotionResponse getBestPromotionForTour(Integer tourId) {
        return promotionRepository
                .findBestPromotionForTour(tourId, LocalDateTime.now())
                .map(this::convertToResponse)
                .orElse(null);
    }

    private void mapRequestToEntity(PromotionRequest request, PromotionEntity entity) {
        entity.setName(request.getName());
        entity.setDiscount(request.getDiscount());
        entity.setDiscountType(request.getDiscountType() != null ?
                request.getDiscountType() : "PERCENT");
        entity.setStartDate(request.getStartDate());
        entity.setEndDate(request.getEndDate());
        entity.setStatus(request.getStatus());
    }

    private PromotionResponse convertToResponse(PromotionEntity entity) {
        Long tourCount = promotionRepository.countToursInPromotion(entity.getId());

        List<String> tourNames = null;
        if (entity.getTours() != null && !entity.getTours().isEmpty()) {
            tourNames = entity.getTours().stream()
                    .map(TourEntity::getName)
                    .limit(5) // Only first 5 for performance
                    .collect(Collectors.toList());
        }

        return PromotionResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .discount(entity.getDiscount())
                .discountType(entity.getDiscountType())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .status(entity.getStatus())
                .isActive(entity.isActive())
                .tourCount(tourCount.intValue())
                .tourNames(tourNames)
                .createdBy(entity.getCreatedBy())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
