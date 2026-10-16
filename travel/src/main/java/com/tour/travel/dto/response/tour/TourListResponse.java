package com.tour.travel.dto.response.tour;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
public class TourListResponse {
    private List<TourResponse> tours;
    private int page;
    private int limit;
    private int totalPages;
    private long totalItems;
}
