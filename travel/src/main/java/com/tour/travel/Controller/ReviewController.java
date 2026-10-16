package com.tour.travel.Controller;

import com.tour.travel.Exceptions.InvalidParamException;
import com.tour.travel.dto.tour.TourReviewSummary;
import com.tour.travel.dto.request.review.ReviewRequest;
import com.tour.travel.dto.response.review.ReviewResponse;
import com.tour.travel.Service.IReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final IReviewService reviewService;

    @PostMapping("")
    public ResponseEntity<ReviewResponse> createReview(
            @Valid @RequestBody ReviewRequest request) throws InvalidParamException {
        ReviewResponse response = reviewService.createReview(request, request.getUserId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Integer id,
            @Valid @RequestBody ReviewRequest request) throws InvalidParamException {
        ReviewResponse response = reviewService.updateReview(id, request, request.getUserId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable Integer id) throws InvalidParamException {
        Integer userId = getCurrentUserId();
        reviewService.deleteReview(id, userId);
        return ResponseEntity.ok("Xóa đánh giá thành công");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> getReviewById(@PathVariable Integer id) {
        ReviewResponse response = reviewService.getReviewById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/tour/{tourId}")
    public ResponseEntity<Page<ReviewResponse>> getReviewsByTour(
            @PathVariable Integer tourId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer rating) {
        Page<ReviewResponse> reviews = reviewService.getReviewsByTour(tourId, page, size, rating);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<ReviewResponse>> getReviewsByUser(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ReviewResponse> reviews = reviewService.getReviewsByUser(userId, page, size);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/my-reviews")
    public ResponseEntity<Page<ReviewResponse>> getMyReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Integer userId = getCurrentUserId();
        Page<ReviewResponse> reviews = reviewService.getReviewsByUser(userId, page, size);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/tour/{tourId}/summary")
    public ResponseEntity<TourReviewSummary> getTourReviewSummary(
            @PathVariable Integer tourId) {
        TourReviewSummary summary = reviewService.getTourReviewSummary(tourId);
        return ResponseEntity.ok(summary);
    }


    @GetMapping("/latest")
    public ResponseEntity<Page<ReviewResponse>> getLatestReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ReviewResponse> reviews = reviewService.getLatestReviews(page, size);
        return ResponseEntity.ok(reviews);
    }


    @GetMapping("/check/{tourId}")
    public ResponseEntity<Boolean> checkUserReviewed(@PathVariable Integer tourId) {
        Integer userId = getCurrentUserId();
        boolean hasReviewed = reviewService.hasUserReviewedTour(tourId, userId);
        return ResponseEntity.ok(hasReviewed);
    }

    @GetMapping("/tour/{tourId}/user/{userId}")
    public ResponseEntity<ReviewResponse> getUserReviewForTour(
            @PathVariable Integer tourId,
            @PathVariable Integer userId) {
        ReviewResponse review = reviewService.getUserReviewForTour(tourId, userId);
        return ResponseEntity.ok(review);
    }

    private Integer getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User chưa đăng nhập");
        }
        return Integer.parseInt(authentication.getName());
    }
}
