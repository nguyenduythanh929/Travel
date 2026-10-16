package com.tour.travel.Service;


import com.tour.travel.Exceptions.InvalidParamException;
import com.tour.travel.dto.tour.TourReviewSummary;
import com.tour.travel.dto.request.review.ReviewRequest;
import com.tour.travel.dto.response.review.ReviewResponse;
import org.springframework.data.domain.Page;


public interface IReviewService {

    ReviewResponse createReview(ReviewRequest request, Integer userId) throws InvalidParamException;

    ReviewResponse updateReview(Integer reviewId, ReviewRequest request, Integer userId) throws InvalidParamException;

    void deleteReview(Integer reviewId, Integer userId) throws InvalidParamException;

    ReviewResponse getReviewById(Integer reviewId);

    Page<ReviewResponse> getReviewsByTour(Integer tourId, int page, int size, Integer rating);

    Page<ReviewResponse> getReviewsByUser(Integer userId, int page, int size);

    TourReviewSummary getTourReviewSummary(Integer tourId);

    Page<ReviewResponse> getLatestReviews(int page, int size);

    boolean hasUserReviewedTour(Integer tourId, Integer userId);

    ReviewResponse getUserReviewForTour(Integer tourId, Integer userId);
}
