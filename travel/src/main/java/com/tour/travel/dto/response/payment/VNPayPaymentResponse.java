package com.tour.travel.dto.response.payment;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VNPayPaymentResponse {
    private String code;
    private String message;
    private String paymentUrl;
    private String vnpTxnRef;
}
