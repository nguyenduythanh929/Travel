package com.tour.travel.dto.tour;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TourReviewSummary {

    @JsonProperty("tour_id")
    private Integer tourId;

    @JsonProperty("tour_name")
    private String tourName;

    @JsonProperty("average_rating")
    private Double averageRating;

    @JsonProperty("total_reviews")
    private Long totalReviews;

    /**
     * Số lượng đánh giá theo từng mức sao
     */
    @JsonProperty("five_star_count")
    private Long fiveStarCount;

    @JsonProperty("four_star_count")
    private Long fourStarCount;

    @JsonProperty("three_star_count")
    private Long threeStarCount;

    @JsonProperty("two_star_count")
    private Long twoStarCount;

    @JsonProperty("one_star_count")
    private Long oneStarCount;
}
