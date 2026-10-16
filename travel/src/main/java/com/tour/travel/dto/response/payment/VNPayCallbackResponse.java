package com.tour.travel.dto.response.payment;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VNPayCallbackResponse {
    private String code;
    private String message;
    private String vnpTxnRef;
    private String vnpTransactionNo;
    private Long vnpAmount;
    private String vnpResponseCode;
    private String vnpBankCode;
    private String vnpPayDate;
    private String vnpCardType;
    private Integer bookingId;
    private String bookingStatus;
}
