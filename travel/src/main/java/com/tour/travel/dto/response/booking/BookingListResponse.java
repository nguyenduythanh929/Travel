package com.tour.travel.dto.response.booking;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class BookingListResponse {
    private List<BookingResponse> data;
    private long totalItems;
    private int totalPages;
    private int currentPage;
}
