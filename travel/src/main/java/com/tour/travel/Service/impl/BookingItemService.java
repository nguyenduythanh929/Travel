package com.tour.travel.Service.impl;

import com.tour.travel.Converter.BookingItemConverter;
import com.tour.travel.Entity.BookingItemEntity;
import com.tour.travel.Exceptions.DataNotFoundException;
import com.tour.travel.dto.response.booking.BookingItemResponse;
import com.tour.travel.Repository.BookingItemRepository;
import com.tour.travel.Repository.BookingRepository;
import com.tour.travel.Service.IBookingItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for reading booking items.
 * BookingItems are created only during checkout and are immutable afterward.
 * All cart operations (add/update/delete) are handled by CartService.
 */
@Service
@RequiredArgsConstructor
public class BookingItemService implements IBookingItemService {

    private final BookingRepository bookingRepository;
    private final BookingItemConverter bookingItemConverter;
    private final BookingItemRepository bookingItemRepository;

    @Override
    @Transactional(readOnly = true)
    public List<BookingItemResponse> getByBookingId(Integer bookingId) {
        bookingRepository.findById(bookingId)
                .orElseThrow(() -> new DataNotFoundException("Booking not found with id: " + bookingId));

        List<BookingItemEntity> items = bookingItemRepository.findByBooking_Id(bookingId);
        return items.stream()
                .map(bookingItemConverter::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BookingItemResponse getById(Integer id) {
        BookingItemEntity item = bookingItemRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Booking item not found with id: " + id));
        return bookingItemConverter.toResponse(item);
    }
}
