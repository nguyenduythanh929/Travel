package com.tour.travel.dto.request.booking;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingItemRequest {
    private Integer tourId;
    private Integer userId;
    private String departureLocation;
    private Integer locationId;
    private Integer adultCount;
    private Integer childCount;
    private Integer infantCount;
}

