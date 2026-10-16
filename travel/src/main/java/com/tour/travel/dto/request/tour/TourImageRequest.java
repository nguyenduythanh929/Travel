package com.tour.travel.dto.request.tour;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourImageRequest {

    @NotBlank(message = "Image URL is required")
    private String imageUrl;
}
