package com.tour.travel.Converter;


import com.tour.travel.Entity.ReviewEntity;
import com.tour.travel.dto.response.review.ReviewResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReviewConverter {

    public ReviewResponse toResponse(ReviewEntity entity) {
        if (entity == null) {
            return null;
        }

        return ReviewResponse.builder()
                .id(entity.getId())
                .rating(entity.getRating())
                .comment(entity.getComment())
                .status(entity.getStatus())
                .tourId(entity.getTour() != null ? entity.getTour().getId() : null)
                .tourName(entity.getTour() != null ? entity.getTour().getName() : null)
                .userId(entity.getUser() != null ? entity.getUser().getId() : null)
                .userName(entity.getUser() != null ? entity.getUser().getName() : null)
                .userAvatar(entity.getUser() != null ? entity.getUser().getAvatar() : null)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
