package com.tour.travel.dto.response.tourtype;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TourTypeListResponse {
    private List<TourTypeResponse> data;
    private long totalItems;
    private int totalPages;
    private int currentPage;
}
