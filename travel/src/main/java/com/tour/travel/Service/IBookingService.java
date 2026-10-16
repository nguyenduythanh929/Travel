package com.tour.travel.Service;

import com.tour.travel.dto.request.booking.BookingFilterRequest;
import com.tour.travel.dto.request.booking.BookingRequest;
import com.tour.travel.dto.request.booking.CancelBookingRequest;
import com.tour.travel.dto.request.payment.ConfirmCashPaymentRequest;
import com.tour.travel.dto.response.booking.BookingListResponse;
import com.tour.travel.dto.response.booking.BookingResponse;

import java.util.List;

/**
 * Service interface for booking management.
 * Handles all booking operations including payment processing, status transitions,
 * expiration handling, and capacity management.
 */
public interface IBookingService {

    // ==================== CRUD OPERATIONS ====================

    BookingResponse updateBooking(Integer bookingId, BookingRequest request);
    BookingResponse getBooking(int id);
    BookingResponse getBookingByCode(String bookingCode);
    BookingResponse getBookingByUserId(Integer userId);
    List<BookingResponse> getBookingsByUserId(Integer userId);
    BookingListResponse getAllBookings(int offset, int limit);
    BookingListResponse searchBookings(BookingFilterRequest request, int offset, int limit);
    void deleteBooking(Integer id);

    // ==================== PAYMENT OPERATIONS ====================

    /**
     * Confirm cash payment by staff (offline payment).
     * Deducts tour capacity upon confirmation.
     */
    BookingResponse confirmCashPayment(ConfirmCashPaymentRequest request, String staffUsername);

    /**
     * Process successful online payment callback.
     * Called by VNPay service after successful payment.
     * Deducts tour capacity.
     */
    BookingResponse processPaymentSuccess(Integer bookingId);

    /**
     * Process failed online payment callback.
     */
    BookingResponse processPaymentFailure(Integer bookingId, String reason);

    // ==================== STATUS TRANSITIONS ====================

    /**
     * Cancel a booking (by user, admin, or system).
     * Restores tour capacity if payment was made.
     */
    BookingResponse cancelBooking(CancelBookingRequest request, String cancelledBy);

    /**
     * Mark booking as completed (after tour ends).
     */
    BookingResponse completeBooking(Integer bookingId);

    /**
     * Mark booking as expired (for unpaid bookings past expiration time).
     */
    BookingResponse expireBooking(Integer bookingId);

    // ==================== EXPIRATION HANDLING ====================

    /**
     * Find and expire all bookings that are past their expiration time.
     * Called by scheduler.
     */
    int expireOverdueBookings();

    /**
     * Check if a booking is expired.
     */
    boolean isBookingExpired(Integer bookingId);

    // ==================== CAPACITY MANAGEMENT ====================

    /**
     * Deduct tour capacity for a booking.
     * Called after successful payment.
     */
    void deductTourCapacity(Integer bookingId);

    /**
     * Restore tour capacity for a booking.
     * Called when booking is cancelled after payment.
     */
    void restoreTourCapacity(Integer bookingId);

    // ==================== BOOKING COMPLETION ====================

    /**
     * Check and mark completed bookings (tours that have ended).
     * Called by scheduler.
     */
    int markCompletedBookings();

    // ==================== ADMIN OPERATIONS ====================

    /**
     * Get bookings by status.
     */
    BookingListResponse getBookingsByStatus(Integer status, int offset, int limit);

    /**
     * Get pending payment bookings.
     */
    BookingListResponse getPendingPaymentBookings(int offset, int limit);

    /**
     * Get bookings expiring soon (within specified hours).
     */
    BookingListResponse getBookingsExpiringSoon(int hours, int offset, int limit);
}
