package com.tour.travel.Service;

import com.tour.travel.dto.response.booking.BookingItemResponse;

import java.util.List;


public interface IBookingItemService {
    List<BookingItemResponse> getByBookingId(Integer bookingId);
    BookingItemResponse getById(Integer id);
}
