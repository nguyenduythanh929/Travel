package com.tour.travel.dto.request.booking;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingFilterRequest {
    private String keyword;
    private Integer status;
    private Integer paymentStatus;
    private Integer paymentMethodId;
    private LocalDate startDate;
    private LocalDate endDate;
}

