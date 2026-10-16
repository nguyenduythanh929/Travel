package com.tour.travel.Service;

import com.tour.travel.dto.response.booking.BookingItemResponse;

import java.util.List;

/**
 * Service interface for reading booking items.
 * BookingItems are created only during checkout and are immutable afterward.
 */
public interface IBookingItemService {
    List<BookingItemResponse> getByBookingId(Integer bookingId);
    BookingItemResponse getById(Integer id);
}
