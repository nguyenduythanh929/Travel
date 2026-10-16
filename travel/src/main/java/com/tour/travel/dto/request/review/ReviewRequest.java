package com.tour.travel.dto.request.review;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {

    @JsonProperty("tour_id")
    @NotNull(message = "Tour ID không được để trống")
    @Positive(message = "Tour ID phải là số dương")
    private Integer tourId;

    @JsonProperty("user_id")
    @NotNull(message = "User ID không được để trống")
    @Positive(message = "User ID phải là số dương")
    private Integer userId;

    @NotNull(message = "Rating không được để trống")
    @Min(value = 1, message = "Rating tối thiểu là 1 sao")
    @Max(value = 5, message = "Rating tối đa là 5 sao")
    private Integer rating;

    @Size(max = 5000, message = "Bình luận không được vượt quá 5000 ký tự")
    private String comment;
}
