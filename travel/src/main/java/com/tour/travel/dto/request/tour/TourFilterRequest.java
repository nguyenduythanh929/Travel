package com.tour.travel.dto.request.tour;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourFilterRequest {
    private String name;
    private String startLocation;
    private String destination;
    private String departureDate;
    private Integer adultCount;
    private Integer childCount;
    private Integer infantCount;
    private Integer priceFrom;
    private Integer priceTo;
    private Integer typeId;
    private String createdBy;
    private LocalDateTime createdDate;
    private Integer status;
}
