package com.tour.travel.dto.response.tour;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TourHomeListResponse {
    private List<TourResponse> domesticTours;
    private List<TourResponse> internationalTours;
}
