package com.tour.travel.dto.request.payment;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request for staff to confirm cash payment (offline payment).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConfirmCashPaymentRequest {

    @NotNull(message = "Booking ID is required")
    private Integer bookingId;

    private String staffNote;
}
