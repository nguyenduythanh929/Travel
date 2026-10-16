package com.tour.travel.dto.request.tourtype;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TourTypeFilterRequest {
    private String name;
    private Integer status;
    private String createdBy;
    private LocalDate startDate;
    private LocalDate endDate;
}
