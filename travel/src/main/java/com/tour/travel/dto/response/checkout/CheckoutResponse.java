package com.tour.travel.dto.response.checkout;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response after successful checkout.
 * Contains booking details and payment information.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutResponse {

    private String code;
    private String message;
    private Integer bookingId;
    private String bookingCode;
    private String status;
    private String statusDescription;
    private Double totalPrice;
    private Double discount;
    private Double finalPrice;
    private String voucherCode;
    private LocalDateTime expirationTime;
    private LocalDateTime createdAt;

    private String paymentUrl;
    private String paymentMethod;

    private String customerName;
    private String customerPhone;
    private String customerEmail;

    private Integer totalAdults;
    private Integer totalChildren;
    private Integer totalInfants;
    private Integer itemCount;
}
