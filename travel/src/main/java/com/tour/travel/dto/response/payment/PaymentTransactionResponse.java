package com.tour.travel.dto.response.payment;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tour.travel.Entity.Enums.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PaymentTransactionResponse {
    private Integer id;
    private String transactionCode;
    private Double amount;
    private PaymentStatus status;
    private String statusDescription;
    private String paymentMethodCode;
    private String paymentMethodName;

    @JsonProperty("payment_time")
    private LocalDateTime paymentTime;

    private String vnpTxnRef;
    private String vnpTransactionNo;
    private String vnpResponseCode;
    private String vnpBankCode;

    private String confirmedBy;

    @JsonProperty("confirmed_at")
    private LocalDateTime confirmedAt;

    private String note;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;
}
