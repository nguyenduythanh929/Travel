package com.tour.travel.Service.impl;

import com.tour.travel.Converter.ReviewConverter;
import com.tour.travel.Entity.Enums.BookingStatus;
import com.tour.travel.Entity.ReviewEntity;
import com.tour.travel.Entity.TourEntity;
import com.tour.travel.Entity.UserEntity;
import com.tour.travel.Exceptions.DataNotFoundException;
import com.tour.travel.Exceptions.InvalidParamException;
import com.tour.travel.dto.tour.TourReviewSummary;
import com.tour.travel.dto.request.review.ReviewRequest;
import com.tour.travel.dto.response.review.ReviewResponse;
import com.tour.travel.Repository.BookingRepository;
import com.tour.travel.Repository.ReviewRepository;
import com.tour.travel.Repository.TourRepository;
import com.tour.travel.Repository.UserRepository;
import com.tour.travel.Service.IReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService {

    private final ReviewRepository reviewRepository;
    private final TourRepository tourRepository;
    private final UserRepository userRepository;
    private final ReviewConverter reviewConverter;
    private final BookingRepository bookingRepository;

    @Override
    @Transactional
    public ReviewResponse createReview(ReviewRequest request, Integer userId) throws InvalidParamException {
        TourEntity tour = tourRepository.findById(request.getTourId())
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy tour với ID: " + request.getTourId()));
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy user với ID: " + userId));

        if (!bookingRepository.existsCompletedBookingForUserAndTour(userId, request.getTourId(), BookingStatus.COMPLETED.getValue())) {
            throw new InvalidParamException("Bạn chỉ có thể đánh giá tour sau khi đã hoàn thành chuyến đi.");
        }

        if (reviewRepository.existsByTourIdAndUserId(request.getTourId(), userId)) {
            throw new InvalidParamException("Bạn đã đánh giá tour này rồi. Vui lòng cập nhật đánh giá thay vì tạo mới.");
        }
        ReviewEntity review = new ReviewEntity();
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setStatus(1);
        review.setTour(tour);
        review.setUser(user);
        ReviewEntity savedReview = reviewRepository.save(review);
        return reviewConverter.toResponse(savedReview);
    }

    @Override
    @Transactional
    public ReviewResponse updateReview(Integer reviewId, ReviewRequest request, Integer userId) throws InvalidParamException {
        ReviewEntity review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy đánh giá với ID: " + reviewId));
        if (!review.getUser().getId().equals(userId)) {
            throw new InvalidParamException("Bạn không có quyền cập nhật đánh giá này");
        }
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        ReviewEntity updatedReview = reviewRepository.save(review);
        return reviewConverter.toResponse(updatedReview);
    }

    @Override
    @Transactional
    public void deleteReview(Integer reviewId, Integer userId) throws InvalidParamException {
        ReviewEntity review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy đánh giá với ID: " + reviewId));
        if (!review.getUser().getId().equals(userId)) {
            throw new InvalidParamException("Bạn không có quyền xóa đánh giá này");
        }
        review.setStatus(0);
        reviewRepository.save(review);
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponse getReviewById(Integer reviewId) {
        ReviewEntity review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy đánh giá với ID: " + reviewId));
        return reviewConverter.toResponse(review);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getReviewsByTour(Integer tourId, int page, int size, Integer rating) {
        if (!tourRepository.existsById(tourId)) {
            throw new DataNotFoundException("Không tìm thấy tour với ID: " + tourId);
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ReviewEntity> reviews;

        if (rating != null) {
            reviews = reviewRepository.findByTourIdAndStatusAndRating(tourId, 1, rating, pageable);
        } else {
            reviews = reviewRepository.findByTourIdAndStatus(tourId, 1, pageable);
        }
        return reviews.map(reviewConverter::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getReviewsByUser(Integer userId, int page, int size) {
        if (!userRepository.existsById(userId)) {
            throw new DataNotFoundException("Không tìm thấy user với ID: " + userId);
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ReviewEntity> reviews = reviewRepository.findByUserIdAndStatus(userId, 1, pageable);
        return reviews.map(reviewConverter::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public TourReviewSummary getTourReviewSummary(Integer tourId) {
        TourEntity tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy tour với ID: " + tourId));
        List<ReviewEntity> reviews = reviewRepository.findByTourIdAndStatus(tourId, 1);
        long totalReviews = reviews.size();
        double averageRating = 0.0;
        if (totalReviews > 0) {
            Double avg = reviewRepository.getAverageRatingByTourId(tourId);
            averageRating = avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
        }
        long fiveStars = reviews.stream().filter(r -> r.getRating() == 5).count();
        long fourStars = reviews.stream().filter(r -> r.getRating() == 4).count();
        long threeStars = reviews.stream().filter(r -> r.getRating() == 3).count();
        long twoStars = reviews.stream().filter(r -> r.getRating() == 2).count();
        long oneStar = reviews.stream().filter(r -> r.getRating() == 1).count();
        return TourReviewSummary.builder()
                .tourId(tourId)
                .tourName(tour.getName())
                .averageRating(averageRating)
                .totalReviews(totalReviews)
                .fiveStarCount(fiveStars)
                .fourStarCount(fourStars)
                .threeStarCount(threeStars)
                .twoStarCount(twoStars)
                .oneStarCount(oneStar)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getLatestReviews(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ReviewEntity> reviews = reviewRepository.findByStatusOrderByCreatedAtDesc(1, pageable);
        return reviews.map(reviewConverter::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasUserReviewedTour(Integer tourId, Integer userId) {
        return reviewRepository.existsByTourIdAndUserId(tourId, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponse getUserReviewForTour(Integer tourId, Integer userId) {
        ReviewEntity review = reviewRepository.findByTourIdAndUserId(tourId, userId)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy đánh giá của bạn cho tour này"));
        return reviewConverter.toResponse(review);
    }
}
