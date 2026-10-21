package com.tour.travel.Service;

import com.tour.travel.dto.request.booking.BookingFilterRequest;
import com.tour.travel.dto.request.booking.BookingRequest;
import com.tour.travel.dto.request.booking.CancelBookingRequest;
import com.tour.travel.dto.request.payment.ConfirmCashPaymentRequest;
import com.tour.travel.dto.response.booking.BookingListResponse;
import com.tour.travel.dto.response.booking.BookingResponse;

import java.util.List;


public interface IBookingService {


    BookingResponse updateBooking(Integer bookingId, BookingRequest request);
    BookingResponse getBooking(int id);
    BookingResponse getBookingByCode(String bookingCode);
    BookingResponse getBookingByUserId(Integer userId);
    List<BookingResponse> getBookingsByUserId(Integer userId);
    BookingListResponse getAllBookings(int offset, int limit);
    BookingListResponse searchBookings(BookingFilterRequest request, int offset, int limit);
    void deleteBooking(Integer id);


    BookingResponse confirmCashPayment(ConfirmCashPaymentRequest request, String staffUsername);


    BookingResponse processPaymentSuccess(Integer bookingId);

    BookingResponse processPaymentFailure(Integer bookingId, String reason);


    BookingResponse cancelBooking(CancelBookingRequest request, String cancelledBy);


    BookingResponse completeBooking(Integer bookingId);

    BookingResponse expireBooking(Integer bookingId);


    int expireOverdueBookings();


    boolean isBookingExpired(Integer bookingId);

    void deductTourCapacity(Integer bookingId);

    void restoreTourCapacity(Integer bookingId);

    int markCompletedBookings();


    BookingListResponse getBookingsByStatus(Integer status, int offset, int limit);


    BookingListResponse getPendingPaymentBookings(int offset, int limit);

    BookingListResponse getBookingsExpiringSoon(int hours, int offset, int limit);
}
