package com.tour.travel.Service;

import com.tour.travel.Entity.BookingEntity;

/**
 * Service interface for real-time WebSocket notifications.
 * Handles booking-related notifications between users and administrators.
 *
 * Channel Design:
 * - /topic/users/{userId} - User-specific notifications
 * - /topic/admin/bookings - Admin notifications for new bookings
 */
public interface INotificationService {

    /**
     * Notify all administrators when a new booking is created.
     * Triggered after successful checkout (booking persisted to database).
     *
     * @param booking The newly created booking entity
     */
    void notifyAdminsNewBooking(BookingEntity booking);

    /**
     * Notify user when their booking status changes.
     * Used for: payment confirmation, cancellation, expiration, completion.
     *
     * @param booking The booking with updated status
     * @param message Short message explaining the update
     */
    void notifyUserBookingStatusChange(BookingEntity booking, String message);

    /**
     * Notify user when cash payment is confirmed by staff.
     *
     * @param booking The booking with confirmed payment
     * @param staffUsername The staff member who confirmed the payment
     */
    void notifyUserPaymentConfirmed(BookingEntity booking, String staffUsername);

    /**
     * Notify user when their booking is cancelled.
     *
     * @param booking The cancelled booking
     * @param reason Cancellation reason
     * @param cancelledBy Who cancelled the booking (USER, ADMIN, SYSTEM)
     */
    void notifyUserBookingCancelled(BookingEntity booking, String reason, String cancelledBy);

    /**
     * Notify user when their booking expires.
     *
     * @param booking The expired booking
     */
    void notifyUserBookingExpired(BookingEntity booking);

    /**
     * Notify user when their booking is marked as completed.
     *
     * @param booking The completed booking
     */
    void notifyUserBookingCompleted(BookingEntity booking);
}
