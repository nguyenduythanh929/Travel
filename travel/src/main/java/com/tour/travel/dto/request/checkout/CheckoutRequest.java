package com.tour.travel.dto.request.checkout;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * Request for checkout - converts selected cart items to a booking.
 * Only selected cart items will be included in the booking.
 * The booking will be created with PENDING_PAYMENT status.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequest {

    @NotNull(message = "User ID is required")
    private Integer userId;

    // List of cart item IDs to checkout (select specific items from cart)
    @NotEmpty(message = "At least one cart item must be selected")
    private List<Integer> cartItemIds;

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Customer phone is required")
    private String customerPhone;

    private String customerEmail;

    private String customerAddress;

    private Integer paymentMethodId;

    private String voucherCode;

    private String note;

    private String specialRequests;

    private String returnUrl;

    // Payment expiration time in hours (default: 24 hours)
    private Integer expirationHours = 24;
}
