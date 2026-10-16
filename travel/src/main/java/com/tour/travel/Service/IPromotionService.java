package com.tour.travel.Service;

import com.tour.travel.dto.request.promotion.PromotionRequest;
import com.tour.travel.dto.response.promotion.PromotionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IPromotionService {

    PromotionResponse createPromotion(PromotionRequest request);

    PromotionResponse updatePromotion(Integer id, PromotionRequest request);

    void deletePromotion(Integer id);

    PromotionResponse getPromotionById(Integer id);

    Page<PromotionResponse> getAllPromotions(Pageable pageable);

    List<PromotionResponse> getActivePromotions();

    void applyPromotionToTours(Integer promotionId, List<Integer> tourIds);

    void removePromotionFromTours(Integer promotionId, List<Integer> tourIds);

    PromotionResponse getBestPromotionForTour(Integer tourId);
}
