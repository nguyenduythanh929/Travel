package com.tour.travel.Controller;

import com.tour.travel.dto.request.checkout.CheckoutRequest;
import com.tour.travel.dto.response.checkout.CheckoutResponse;
import com.tour.travel.Service.ICheckoutService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for checkout operations.
 * Converts selected cart items to a booking with PENDING_PAYMENT status.
 */
@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final ICheckoutService checkoutService;

    /**
     * Process checkout - create booking from selected cart items.
     * The booking will be created with PENDING_PAYMENT status.
     * Tour capacity is NOT deducted at this stage - only after successful payment.
     */
    @PostMapping
    public ResponseEntity<CheckoutResponse> checkout(
            @Valid @RequestBody CheckoutRequest request,
            HttpServletRequest httpRequest) {
        try {
            CheckoutResponse response = checkoutService.checkout(request, httpRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(CheckoutResponse.builder()
                    .code("99")
                    .message("Checkout failed: " + e.getMessage())
                    .build());
        }
    }

    /**
     * Get checkout summary without creating a booking.
     * Useful for preview before final checkout.
     */
    @PostMapping("/summary")
    public ResponseEntity<CheckoutResponse> getCheckoutSummary(
            @Valid @RequestBody CheckoutRequest request) {
        try {
            CheckoutResponse response = checkoutService.getCheckoutSummary(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(CheckoutResponse.builder()
                    .code("99")
                    .message("Failed to get checkout summary: " + e.getMessage())
                    .build());
        }
    }
}
