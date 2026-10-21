package com.tour.travel.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for WebSocket booking notifications.
 * Used for both User→Admin and Admin→User notifications.
 *
 * Notification Types:
 * - NEW_BOOKING: User creates a booking (sent to admins)
 * - BOOKING_PAID: Payment confirmed (sent to user)
 * - BOOKING_CANCELLED: Booking cancelled (sent to user)
 * - BOOKING_EXPIRED: Booking expired (sent to user)
 * - BOOKING_COMPLETED: Booking completed (sent to user)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingNotificationDTO {

    private Integer bookingId;

    private String bookingCode;

    private String status;

    private String message;

    private LocalDateTime timestamp;

    private String customerName;

    private Double totalAmount;

    private Integer userId;

    private String notificationType;
}
