package com.tour.travel.Service;

import com.tour.travel.dto.request.checkout.CheckoutRequest;
import com.tour.travel.dto.response.checkout.CheckoutResponse;
import jakarta.servlet.http.HttpServletRequest;

/**
 * Service interface for checkout operations.
 * Converts selected cart items to a booking with PENDING_PAYMENT status.
 */
public interface ICheckoutService {

    /**
     * Process checkout - create booking from selected cart items.
     *
     * @param request Checkout request with cart item IDs and customer info
     * @param httpRequest HTTP request for payment URL generation
     * @return Checkout response with booking details and payment URL
     */
    CheckoutResponse checkout(CheckoutRequest request, HttpServletRequest httpRequest);

    /**
     * Get checkout summary without creating a booking.
     * Useful for preview before final checkout.
     */
    CheckoutResponse getCheckoutSummary(CheckoutRequest request);
}
