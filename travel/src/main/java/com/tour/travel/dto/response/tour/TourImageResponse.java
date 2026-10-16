package com.tour.travel.dto.response.tour;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourImageResponse {
    private Integer id;
    private Integer tourId;
    private String imageUrl;
}
