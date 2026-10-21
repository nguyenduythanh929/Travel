package com.tour.travel.Service;

import com.tour.travel.dto.request.cart.AddToCartRequest;
import com.tour.travel.dto.request.cart.UpdateCartItemRequest;
import com.tour.travel.dto.response.cart.CartItemResponse;
import com.tour.travel.dto.response.cart.CartResponse;

import java.util.List;


public interface ICartService {


    CartResponse getCartByUserId(Integer userId);

    CartItemResponse addToCart(AddToCartRequest request);

    CartItemResponse updateCartItem(Integer cartItemId, Integer userId, UpdateCartItemRequest request);

    void removeCartItem(Integer cartItemId, Integer userId);

    void removeCartItems(List<Integer> cartItemIds, Integer userId);

    void clearCart(Integer userId);

    Integer getCartItemCount(Integer userId);

    boolean isTourInCart(Integer userId, Integer tourId);

    List<CartItemResponse> getCartItemsByIds(List<Integer> cartItemIds, Integer userId);

    void validateCartItemsForCheckout(List<Integer> cartItemIds, Integer userId);
}
