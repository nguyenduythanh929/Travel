package com.tour.travel.Controller;

import com.tour.travel.dto.response.booking.BookingItemResponse;
import com.tour.travel.Exceptions.DataNotFoundException;
import com.tour.travel.Service.IBookingItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller for reading booking items.
 * BookingItems are created only during checkout and are immutable afterward.
 * All cart operations (add/update/delete) are handled by CartController.
 */
@RestController
@RequestMapping("/api/booking-items")
@RequiredArgsConstructor
public class BookingItemController {

    private final IBookingItemService bookingItemService;

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getBookingItems(@PathVariable Integer bookingId) {
        try {
            List<BookingItemResponse> items = bookingItemService.getByBookingId(bookingId);
            return ResponseEntity.ok(items);
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingItem(@PathVariable Integer id) {
        try {
            BookingItemResponse item = bookingItemService.getById(id);
            return ResponseEntity.ok(item);
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
