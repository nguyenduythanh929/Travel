package com.tour.travel.dto.request.booking;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request for cancelling a booking.
 * Can be used by both users and administrators.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CancelBookingRequest {

    @NotNull(message = "Booking ID is required")
    private Integer bookingId;

    private String reason;

    // Refund amount (if applicable, for admin use)
    private Double refundAmount;

    // Whether to restore tour capacity (default: true if booking was paid)
    private Boolean restoreCapacity = true;
}
