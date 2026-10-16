package com.tour.travel.dto.request.payment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VNPayPaymentRequest {
    private Integer bookingId;
    private Long amount;
    private String bankCode;
    private String orderInfo;
    private String returnUrl;
}
