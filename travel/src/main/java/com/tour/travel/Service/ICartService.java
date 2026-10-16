package com.tour.travel.Service;

import com.tour.travel.dto.request.cart.AddToCartRequest;
import com.tour.travel.dto.request.cart.UpdateCartItemRequest;
import com.tour.travel.dto.response.cart.CartItemResponse;
import com.tour.travel.dto.response.cart.CartResponse;

import java.util.List;

/**
 * Service interface for shopping cart management.
 * Cart is used for temporary purchase intent only - no payment or status logic.
 */
public interface ICartService {

    /**
     * Get cart for a user. Creates a new cart if none exists.
     */
    CartResponse getCartByUserId(Integer userId);

    /**
     * Add a tour to the user's cart.
     */
    CartItemResponse addToCart(AddToCartRequest request);

    /**
     * Update a cart item (quantity, departure date, etc.).
     */
    CartItemResponse updateCartItem(Integer cartItemId, Integer userId, UpdateCartItemRequest request);

    /**
     * Remove a specific item from the cart.
     */
    void removeCartItem(Integer cartItemId, Integer userId);

    /**
     * Remove multiple items from the cart.
     */
    void removeCartItems(List<Integer> cartItemIds, Integer userId);

    /**
     * Clear all items from the user's cart.
     */
    void clearCart(Integer userId);

    /**
     * Get the number of items in the user's cart.
     */
    Integer getCartItemCount(Integer userId);

    /**
     * Check if a tour is already in the user's cart.
     */
    boolean isTourInCart(Integer userId, Integer tourId);

    /**
     * Get specific cart items by IDs (for checkout).
     */
    List<CartItemResponse> getCartItemsByIds(List<Integer> cartItemIds, Integer userId);

    /**
     * Validate cart items for checkout (check availability, capacity, etc.).
     */
    void validateCartItemsForCheckout(List<Integer> cartItemIds, Integer userId);
}
