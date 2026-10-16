package com.tour.travel.Controller;

import com.tour.travel.Entity.Enums.BookingStatus;
import com.tour.travel.Exceptions.DataNotFoundException;
import com.tour.travel.dto.request.booking.BookingFilterRequest;
import com.tour.travel.dto.request.booking.BookingRequest;
import com.tour.travel.dto.request.booking.CancelBookingRequest;
import com.tour.travel.dto.response.booking.BookingListResponse;
import com.tour.travel.dto.response.booking.BookingResponse;
import com.tour.travel.Service.IBookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for user booking operations.
 * Bookings are created during checkout and represent official orders.
 */
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final IBookingService bookingService;

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(
            @PathVariable Integer id,
            @Valid @RequestBody BookingRequest request) {
        try {
            BookingResponse response = bookingService.updateBooking(id, request);
            return ResponseEntity.ok(response);
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllBookings(
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            if (limit < 1 || limit > 100) {
                return ResponseEntity.badRequest().body(Map.of("error", "Limit must be between 1 and 100"));
            }
            BookingListResponse response = bookingService.getAllBookings(offset, limit);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchBookings(
            @ModelAttribute BookingFilterRequest request,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            if (limit < 1 || limit > 100) {
                return ResponseEntity.badRequest().body(Map.of("error", "Limit must be between 1 and 100"));
            }
            BookingListResponse response = bookingService.searchBookings(request, offset, limit);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBooking(@PathVariable Integer id) {
        try {
            BookingResponse response = bookingService.getBooking(id);
            return ResponseEntity.ok(response);
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/code/{bookingCode}")
    public ResponseEntity<?> getBookingByCode(@PathVariable String bookingCode) {
        try {
            if (bookingCode == null || bookingCode.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Booking code is required"));
            }
            BookingResponse response = bookingService.getBookingByCode(bookingCode.trim());
            return ResponseEntity.ok(response);
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getBookingByUserId(@PathVariable Integer userId) {
        try {
            BookingResponse response = bookingService.getBookingByUserId(userId);
            return ResponseEntity.ok(response);
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}/all")
    public ResponseEntity<?> getBookingsByUserId(@PathVariable Integer userId) {
        try {
            List<BookingResponse> response = bookingService.getBookingsByUserId(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/cancel")
    public ResponseEntity<?> cancelBooking(@Valid @RequestBody CancelBookingRequest request) {
        try {
            if (request.getBookingId() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Booking ID is required"));
            }
            String username = getCurrentUsername();
            BookingResponse response = bookingService.cancelBooking(request, "USER:" + username);
            return ResponseEntity.ok(response);
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/is-expired")
    public ResponseEntity<?> isBookingExpired(@PathVariable Integer id) {
        try {
            boolean isExpired = bookingService.isBookingExpired(id);
            return ResponseEntity.ok(Map.of("isExpired", isExpired));
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/status-info")
    public ResponseEntity<Map<String, Object>> getStatusInfo() {
        List<Map<String, Object>> statuses = Arrays.stream(BookingStatus.values())
                .map(status -> Map.<String, Object>of(
                        "value", status.getValue(),
                        "name", status.name(),
                        "description", status.getDescription()))
                .toList();
        return ResponseEntity.ok(Map.of("statuses", statuses));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Integer id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.ok(Map.of("message", "Booking deleted successfully"));
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return "unknown";
    }
}
