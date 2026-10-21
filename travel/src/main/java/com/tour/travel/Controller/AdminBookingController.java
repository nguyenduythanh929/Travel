package com.tour.travel.Controller;

import com.tour.travel.Entity.Enums.BookingStatus;
import com.tour.travel.Exceptions.DataNotFoundException;
import com.tour.travel.dto.request.booking.CancelBookingRequest;
import com.tour.travel.dto.request.payment.ConfirmCashPaymentRequest;
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
import java.util.Map;


@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
public class AdminBookingController {

    private final IBookingService bookingService;

    @PostMapping("/confirm-cash-payment")
    public ResponseEntity<?> confirmCashPayment(@Valid @RequestBody ConfirmCashPaymentRequest request) {
        try {
            if (request.getBookingId() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Booking ID is required"));
            }
            String staffUsername = getCurrentUsername();
            BookingResponse response = bookingService.confirmCashPayment(request, staffUsername);
            return ResponseEntity.ok(response);
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
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
            String adminUsername = getCurrentUsername();
            BookingResponse response = bookingService.cancelBooking(request, "ADMIN:" + adminUsername);
            return ResponseEntity.ok(response);
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{bookingId}/complete")
    public ResponseEntity<?> completeBooking(@PathVariable Integer bookingId) {
        try {
            BookingResponse response = bookingService.completeBooking(bookingId);
            return ResponseEntity.ok(response);
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @GetMapping("/status/{status}")
    public ResponseEntity<?> getBookingsByStatus(
            @PathVariable Integer status,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            boolean validStatus = Arrays.stream(BookingStatus.values())
                    .anyMatch(s -> s.getValue() == status);
            if (!validStatus) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid booking status: " + status));
            }
            if (limit < 1 || limit > 100) {
                return ResponseEntity.badRequest().body(Map.of("error", "Limit must be between 1 and 100"));
            }
            BookingListResponse response = bookingService.getBookingsByStatus(status, offset, limit);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/pending-payment")
    public ResponseEntity<?> getPendingPaymentBookings(
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            if (limit < 1 || limit > 100) {
                return ResponseEntity.badRequest().body(Map.of("error", "Limit must be between 1 and 100"));
            }
            BookingListResponse response = bookingService.getPendingPaymentBookings(offset, limit);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @GetMapping("/expiring-soon")
    public ResponseEntity<?> getBookingsExpiringSoon(
            @RequestParam(defaultValue = "6") int hours,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            if (hours < 1 || hours > 72) {
                return ResponseEntity.badRequest().body(Map.of("error", "Hours must be between 1 and 72"));
            }
            if (limit < 1 || limit > 100) {
                return ResponseEntity.badRequest().body(Map.of("error", "Limit must be between 1 and 100"));
            }
            BookingListResponse response = bookingService.getBookingsExpiringSoon(hours, offset, limit);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getBooking(@PathVariable Integer bookingId) {
        try {
            BookingResponse response = bookingService.getBooking(bookingId);
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


    @PostMapping("/{bookingId}/expire")
    public ResponseEntity<?> expireBooking(@PathVariable Integer bookingId) {
        try {
            BookingResponse response = bookingService.expireBooking(bookingId);
            return ResponseEntity.ok(response);
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @PostMapping("/run-expiration-check")
    public ResponseEntity<?> runExpirationCheck() {
        try {
            int expiredCount = bookingService.expireOverdueBookings();
            int completedCount = bookingService.markCompletedBookings();
            return ResponseEntity.ok(Map.of(
                    "message", "Expiration check completed",
                    "expiredBookings", expiredCount,
                    "completedBookings", completedCount
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/status-options")
    public ResponseEntity<Map<String, Object>> getStatusOptions() {
        var statuses = Arrays.stream(BookingStatus.values())
                .map(status -> Map.of(
                        "value", status.getValue(),
                        "name", status.name(),
                        "description", status.getDescription()
                ))
                .toList();
        return ResponseEntity.ok(Map.of("statuses", statuses));
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return "unknown";
    }
}
