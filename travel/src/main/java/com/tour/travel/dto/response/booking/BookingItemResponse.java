package com.tour.travel.dto.response.booking;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class BookingItemResponse {
    private Integer id;
    private Integer tourId;
    private String tourName;
    private String tourImage;
    private LocalDate departureDate;
    private Integer adultCount;
    private Integer childCount;
    private Integer infantCount;
    private String departureLocation;
    private Double pricePerAdult;
    private Double pricePerChild;
    private Double pricePerInfant;
    private Double subTotal;
}

