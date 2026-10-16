package com.tour.travel.Service.impl;

import com.tour.travel.Entity.BookingEntity;
import com.tour.travel.Entity.Enums.BookingStatus;
import com.tour.travel.Service.INotificationService;
import com.tour.travel.dto.notification.BookingNotificationDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Service implementation for real-time WebSocket notifications.
 * Sends notifications through STOMP message broker.
 *
 * Topics:
 * - /topic/admin/bookings - All admins receive new booking notifications
 * - /topic/users/{userId} - Individual users receive their booking updates
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService implements INotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    // WebSocket topic destinations
    private static final String ADMIN_BOOKING_TOPIC = "/topic/admin/bookings";
    private static final String USER_TOPIC_PREFIX = "/topic/users/";

    @Override
    public void notifyAdminsNewBooking(BookingEntity booking) {
        try {
            BookingNotificationDTO notification = BookingNotificationDTO.builder()
                    .bookingId(booking.getId())
                    .bookingCode(booking.getBookingCode())
                    .status(BookingStatus.fromValue(booking.getStatus()).name())
                    .message("New booking created: " + booking.getBookingCode())
                    .timestamp(LocalDateTime.now())
                    .customerName(booking.getCustomerName())
                    .totalAmount(booking.getFinalPrice())
                    .userId(booking.getUser() != null ? booking.getUser().getId() : null)
                    .notificationType("NEW_BOOKING")
                    .build();

            messagingTemplate.convertAndSend(ADMIN_BOOKING_TOPIC, notification);
            log.info("Sent new booking notification to admins: {}", booking.getBookingCode());
        } catch (Exception e) {
            // Notification failure should not affect booking flow
            log.error("Failed to send new booking notification for {}: {}",
                    booking.getBookingCode(), e.getMessage());
        }
    }

    @Override
    public void notifyUserBookingStatusChange(BookingEntity booking, String message) {
        if (booking.getUser() == null) {
            log.warn("Cannot notify user - booking {} has no associated user", booking.getBookingCode());
            return;
        }

        try {
            BookingNotificationDTO notification = BookingNotificationDTO.builder()
                    .bookingId(booking.getId())
                    .bookingCode(booking.getBookingCode())
                    .status(BookingStatus.fromValue(booking.getStatus()).name())
                    .message(message)
                    .timestamp(LocalDateTime.now())
                    .customerName(booking.getCustomerName())
                    .totalAmount(booking.getFinalPrice())
                    .userId(booking.getUser().getId())
                    .notificationType("STATUS_CHANGE")
                    .build();

            String userTopic = USER_TOPIC_PREFIX + booking.getUser().getId();
            messagingTemplate.convertAndSend(userTopic, notification);
            log.info("Sent status change notification to user {}: {} - {}",
                    booking.getUser().getId(), booking.getBookingCode(), message);
        } catch (Exception e) {
            log.error("Failed to send status change notification for {}: {}",
                    booking.getBookingCode(), e.getMessage());
        }
    }

    @Override
    public void notifyUserPaymentConfirmed(BookingEntity booking, String staffUsername) {
        if (booking.getUser() == null) {
            log.warn("Cannot notify user - booking {} has no associated user", booking.getBookingCode());
            return;
        }

        try {
            String message = String.format(
                    "Your payment for booking %s has been confirmed. Thank you for your purchase!",
                    booking.getBookingCode()
            );

            BookingNotificationDTO notification = BookingNotificationDTO.builder()
                    .bookingId(booking.getId())
                    .bookingCode(booking.getBookingCode())
                    .status(BookingStatus.PAID.name())
                    .message(message)
                    .timestamp(LocalDateTime.now())
                    .customerName(booking.getCustomerName())
                    .totalAmount(booking.getFinalPrice())
                    .userId(booking.getUser().getId())
                    .notificationType("PAYMENT_CONFIRMED")
                    .build();

            String userTopic = USER_TOPIC_PREFIX + booking.getUser().getId();
            messagingTemplate.convertAndSend(userTopic, notification);
            log.info("Sent payment confirmed notification to user {}: {}",
                    booking.getUser().getId(), booking.getBookingCode());
        } catch (Exception e) {
            log.error("Failed to send payment confirmed notification for {}: {}",
                    booking.getBookingCode(), e.getMessage());
        }
    }

    @Override
    public void notifyUserBookingCancelled(BookingEntity booking, String reason, String cancelledBy) {
        if (booking.getUser() == null) {
            log.warn("Cannot notify user - booking {} has no associated user", booking.getBookingCode());
            return;
        }

        try {
            String message;
            if ("USER".equalsIgnoreCase(cancelledBy)) {
                message = String.format("Your booking %s has been cancelled as requested.", booking.getBookingCode());
            } else if ("SYSTEM".equalsIgnoreCase(cancelledBy)) {
                message = String.format("Your booking %s has been cancelled by the system. Reason: %s",
                        booking.getBookingCode(), reason != null ? reason : "N/A");
            } else {
                message = String.format("Your booking %s has been cancelled by an administrator. Reason: %s",
                        booking.getBookingCode(), reason != null ? reason : "N/A");
            }

            BookingNotificationDTO notification = BookingNotificationDTO.builder()
                    .bookingId(booking.getId())
                    .bookingCode(booking.getBookingCode())
                    .status(BookingStatus.CANCELLED.name())
                    .message(message)
                    .timestamp(LocalDateTime.now())
                    .customerName(booking.getCustomerName())
                    .totalAmount(booking.getFinalPrice())
                    .userId(booking.getUser().getId())
                    .notificationType("BOOKING_CANCELLED")
                    .build();

            String userTopic = USER_TOPIC_PREFIX + booking.getUser().getId();
            messagingTemplate.convertAndSend(userTopic, notification);
            log.info("Sent cancellation notification to user {}: {}",
                    booking.getUser().getId(), booking.getBookingCode());
        } catch (Exception e) {
            log.error("Failed to send cancellation notification for {}: {}",
                    booking.getBookingCode(), e.getMessage());
        }
    }

    @Override
    public void notifyUserBookingExpired(BookingEntity booking) {
        if (booking.getUser() == null) {
            log.warn("Cannot notify user - booking {} has no associated user", booking.getBookingCode());
            return;
        }

        try {
            String message = String.format(
                    "Your booking %s has expired due to payment timeout. Please create a new booking if you wish to proceed.",
                    booking.getBookingCode()
            );

            BookingNotificationDTO notification = BookingNotificationDTO.builder()
                    .bookingId(booking.getId())
                    .bookingCode(booking.getBookingCode())
                    .status(BookingStatus.EXPIRED.name())
                    .message(message)
                    .timestamp(LocalDateTime.now())
                    .customerName(booking.getCustomerName())
                    .totalAmount(booking.getFinalPrice())
                    .userId(booking.getUser().getId())
                    .notificationType("BOOKING_EXPIRED")
                    .build();

            String userTopic = USER_TOPIC_PREFIX + booking.getUser().getId();
            messagingTemplate.convertAndSend(userTopic, notification);
            log.info("Sent expiration notification to user {}: {}",
                    booking.getUser().getId(), booking.getBookingCode());
        } catch (Exception e) {
            log.error("Failed to send expiration notification for {}: {}",
                    booking.getBookingCode(), e.getMessage());
        }
    }

    @Override
    public void notifyUserBookingCompleted(BookingEntity booking) {
        if (booking.getUser() == null) {
            log.warn("Cannot notify user - booking {} has no associated user", booking.getBookingCode());
            return;
        }

        try {
            String message = String.format(
                    "Your booking %s has been completed. We hope you enjoyed your tour! Please consider leaving a review.",
                    booking.getBookingCode()
            );

            BookingNotificationDTO notification = BookingNotificationDTO.builder()
                    .bookingId(booking.getId())
                    .bookingCode(booking.getBookingCode())
                    .status(BookingStatus.COMPLETED.name())
                    .message(message)
                    .timestamp(LocalDateTime.now())
                    .customerName(booking.getCustomerName())
                    .totalAmount(booking.getFinalPrice())
                    .userId(booking.getUser().getId())
                    .notificationType("BOOKING_COMPLETED")
                    .build();

            String userTopic = USER_TOPIC_PREFIX + booking.getUser().getId();
            messagingTemplate.convertAndSend(userTopic, notification);
            log.info("Sent completion notification to user {}: {}",
                    booking.getUser().getId(), booking.getBookingCode());
        } catch (Exception e) {
            log.error("Failed to send completion notification for {}: {}",
                    booking.getBookingCode(), e.getMessage());
        }
    }
}
