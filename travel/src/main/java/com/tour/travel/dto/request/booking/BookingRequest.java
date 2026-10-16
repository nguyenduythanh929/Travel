package com.tour.travel.dto.request.booking;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    private Integer userId;
    private String customerName;
    private String customerPhone;
    private Integer paymentMethodId;
    private Integer paymentStatus;
    private String note;
    private Integer status;
    private String voucherCode;
}

