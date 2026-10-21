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

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final ICartService cartService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<CartResponse> getCart(@PathVariable Integer userId) {
        CartResponse cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/add")
    public ResponseEntity<CartItemResponse> addToCart(@Valid @RequestBody AddToCartRequest request) {
        CartItemResponse item = cartService.addToCart(request);
        return ResponseEntity.ok(item);
    }

    @PutMapping("/item/{cartItemId}/user/{userId}")
    public ResponseEntity<CartItemResponse> updateCartItem(
            @PathVariable Integer cartItemId,
            @PathVariable Integer userId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        CartItemResponse item = cartService.updateCartItem(cartItemId, userId, request);
        return ResponseEntity.ok(item);
    }

    @DeleteMapping("/item/{cartItemId}/user/{userId}")
    public ResponseEntity<Map<String, String>> removeCartItem(
            @PathVariable Integer cartItemId,
            @PathVariable Integer userId) {
        cartService.removeCartItem(cartItemId, userId);
        return ResponseEntity.ok(Map.of("message", "Item removed from cart successfully"));
    }

    @DeleteMapping("/items/user/{userId}")
    public ResponseEntity<Map<String, String>> removeCartItems(
            @PathVariable Integer userId,
            @RequestBody List<Integer> cartItemIds) {
        cartService.removeCartItems(cartItemIds, userId);
        return ResponseEntity.ok(Map.of("message", "Items removed from cart successfully"));
    }

    @DeleteMapping("/clear/user/{userId}")
    public ResponseEntity<Map<String, String>> clearCart(@PathVariable Integer userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok(Map.of("message", "Cart cleared successfully"));
    }

    @GetMapping("/count/user/{userId}")
    public ResponseEntity<Map<String, Integer>> getCartItemCount(@PathVariable Integer userId) {
        Integer count = cartService.getCartItemCount(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @GetMapping("/check/user/{userId}/tour/{tourId}")
    public ResponseEntity<Map<String, Boolean>> isTourInCart(
            @PathVariable Integer userId,
            @PathVariable Integer tourId) {
        boolean inCart = cartService.isTourInCart(userId, tourId);
        return ResponseEntity.ok(Map.of("inCart", inCart));
    }

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
