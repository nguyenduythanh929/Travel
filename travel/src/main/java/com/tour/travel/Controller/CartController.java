package com.tour.travel.Controller;

import com.tour.travel.dto.request.cart.AddToCartRequest;
import com.tour.travel.dto.request.cart.UpdateCartItemRequest;
import com.tour.travel.dto.response.cart.CartItemResponse;
import com.tour.travel.dto.response.cart.CartResponse;
import com.tour.travel.Service.ICartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for shopping cart management.
 * Cart is used for temporary purchase intent only - no payment or status logic.
 * Users can add tours to cart, update quantities, and select items for checkout.
 */
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final ICartService cartService;

    /**
     * Get the user's shopping cart.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<CartResponse> getCart(@PathVariable Integer userId) {
        CartResponse cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cart);
    }

    /**
     * Add a tour to the shopping cart.
     */
    @PostMapping("/add")
    public ResponseEntity<CartItemResponse> addToCart(@Valid @RequestBody AddToCartRequest request) {
        CartItemResponse item = cartService.addToCart(request);
        return ResponseEntity.ok(item);
    }

    /**
     * Update a cart item (quantity, departure date, etc.).
     */
    @PutMapping("/item/{cartItemId}/user/{userId}")
    public ResponseEntity<CartItemResponse> updateCartItem(
            @PathVariable Integer cartItemId,
            @PathVariable Integer userId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        CartItemResponse item = cartService.updateCartItem(cartItemId, userId, request);
        return ResponseEntity.ok(item);
    }

    /**
     * Remove a specific item from the cart.
     */
    @DeleteMapping("/item/{cartItemId}/user/{userId}")
    public ResponseEntity<Map<String, String>> removeCartItem(
            @PathVariable Integer cartItemId,
            @PathVariable Integer userId) {
        cartService.removeCartItem(cartItemId, userId);
        return ResponseEntity.ok(Map.of("message", "Item removed from cart successfully"));
    }

    /**
     * Remove multiple items from the cart.
     */
    @DeleteMapping("/items/user/{userId}")
    public ResponseEntity<Map<String, String>> removeCartItems(
            @PathVariable Integer userId,
            @RequestBody List<Integer> cartItemIds) {
        cartService.removeCartItems(cartItemIds, userId);
        return ResponseEntity.ok(Map.of("message", "Items removed from cart successfully"));
    }

    /**
     * Clear all items from the user's cart.
     */
    @DeleteMapping("/clear/user/{userId}")
    public ResponseEntity<Map<String, String>> clearCart(@PathVariable Integer userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok(Map.of("message", "Cart cleared successfully"));
    }

    /**
     * Get the number of items in the user's cart.
     */
    @GetMapping("/count/user/{userId}")
    public ResponseEntity<Map<String, Integer>> getCartItemCount(@PathVariable Integer userId) {
        Integer count = cartService.getCartItemCount(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    /**
     * Check if a tour is already in the user's cart.
     */
    @GetMapping("/check/user/{userId}/tour/{tourId}")
    public ResponseEntity<Map<String, Boolean>> isTourInCart(
            @PathVariable Integer userId,
            @PathVariable Integer tourId) {
        boolean inCart = cartService.isTourInCart(userId, tourId);
        return ResponseEntity.ok(Map.of("inCart", inCart));
    }

    /**
     * Validate cart items before checkout.
     */
    @PostMapping("/validate/user/{userId}")
    public ResponseEntity<Map<String, Object>> validateCartItemsForCheckout(
            @PathVariable Integer userId,
            @RequestBody List<Integer> cartItemIds) {
        try {
            cartService.validateCartItemsForCheckout(cartItemIds, userId);
            List<CartItemResponse> items = cartService.getCartItemsByIds(cartItemIds, userId);
            double totalAmount = items.stream()
                    .mapToDouble(item -> item.getSubtotal() != null ? item.getSubtotal() : 0.0)
                    .sum();
            return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "message", "Cart items are valid for checkout",
                    "items", items,
                    "totalAmount", totalAmount
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "valid", false,
                    "message", e.getMessage()
            ));
        }
    }
}
