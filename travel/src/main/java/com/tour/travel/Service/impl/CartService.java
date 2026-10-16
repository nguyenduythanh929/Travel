package com.tour.travel.Service.impl;

import com.tour.travel.Entity.CartEntity;
import com.tour.travel.Entity.CartItemEntity;
import com.tour.travel.Entity.TourEntity;
import com.tour.travel.Entity.UserEntity;
import com.tour.travel.Exceptions.DataNotFoundException;
import com.tour.travel.dto.request.cart.AddToCartRequest;
import com.tour.travel.dto.request.cart.UpdateCartItemRequest;
import com.tour.travel.dto.response.cart.CartItemResponse;
import com.tour.travel.dto.response.cart.CartResponse;
import com.tour.travel.Repository.CartItemRepository;
import com.tour.travel.Repository.CartRepository;
import com.tour.travel.Repository.TourRepository;
import com.tour.travel.Repository.UserRepository;
import com.tour.travel.Service.ICartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for shopping cart management.
 * Cart is used for temporary purchase intent only - no payment or status logic.
 */
@Service
@RequiredArgsConstructor
public class CartService implements ICartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final TourRepository tourRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCartByUserId(Integer userId) {
        CartEntity cart = getOrCreateCart(userId);
        return toCartResponse(cart);
    }

    @Override
    @Transactional
    public CartItemResponse addToCart(AddToCartRequest request) {
        // Validate user exists
        UserEntity user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new DataNotFoundException("User not found with id: " + request.getUserId()));

        // Validate tour exists and is active
        TourEntity tour = tourRepository.findById(request.getTourId())
                .orElseThrow(() -> new DataNotFoundException("Tour not found with id: " + request.getTourId()));

        if (tour.getStatus() == null || tour.getStatus() != 1) {
            throw new RuntimeException("Tour is not available for booking");
        }

        // Get or create cart
        CartEntity cart = getOrCreateCart(request.getUserId());

        // Check if tour already exists in cart
        CartItemEntity existingItem = cartItemRepository.findByCartIdAndTourId(cart.getId(), request.getTourId())
                .orElse(null);

        if (existingItem != null) {
            // Update existing item
            existingItem.setAdultCount((existingItem.getAdultCount() != null ? existingItem.getAdultCount() : 0) +
                    (request.getAdultCount() != null ? request.getAdultCount() : 0));
            existingItem.setChildCount((existingItem.getChildCount() != null ? existingItem.getChildCount() : 0) +
                    (request.getChildCount() != null ? request.getChildCount() : 0));
            existingItem.setInfantCount((existingItem.getInfantCount() != null ? existingItem.getInfantCount() : 0) +
                    (request.getInfantCount() != null ? request.getInfantCount() : 0));

            if (request.getDepartureDate() != null) {
                existingItem.setDepartureDate(request.getDepartureDate());
            }
            if (request.getDepartureLocation() != null) {
                existingItem.setDepartureLocation(request.getDepartureLocation());
            }
            if (request.getSpecialRequests() != null) {
                existingItem.setSpecialRequests(request.getSpecialRequests());
            }

            // Validate capacity
            validateCapacity(tour, existingItem);

            CartItemEntity saved = cartItemRepository.save(existingItem);
            cart.recalculateTotals();
            cartRepository.save(cart);

            return toCartItemResponse(saved);
        }

        // Create new cart item
        CartItemEntity cartItem = new CartItemEntity();
        cartItem.setCart(cart);
        cartItem.setTour(tour);
        cartItem.setAdultCount(request.getAdultCount() != null ? request.getAdultCount() : 0);
        cartItem.setChildCount(request.getChildCount() != null ? request.getChildCount() : 0);
        cartItem.setInfantCount(request.getInfantCount() != null ? request.getInfantCount() : 0);
        cartItem.setDepartureDate(request.getDepartureDate());
        cartItem.setDepartureLocation(request.getDepartureLocation());
        cartItem.setSpecialRequests(request.getSpecialRequests());

        // Set prices from tour
        cartItem.setPriceAdult(tour.getPriceAdult());
        cartItem.setPriceChild(tour.getPriceChild());
        cartItem.setPriceInfant(tour.getPriceInfant());

        // Validate capacity
        validateCapacity(tour, cartItem);

        CartItemEntity saved = cartItemRepository.save(cartItem);

        cart.addItem(saved);
        cartRepository.save(cart);

        return toCartItemResponse(saved);
    }

    @Override
    @Transactional
    public CartItemResponse updateCartItem(Integer cartItemId, Integer userId, UpdateCartItemRequest request) {
        CartItemEntity cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new DataNotFoundException("Cart item not found with id: " + cartItemId));

        // Verify ownership
        if (!cartItem.getCart().getUser().getId().equals(userId)) {
            throw new RuntimeException("Cart item does not belong to this user");
        }

        if (request.getAdultCount() != null) {
            cartItem.setAdultCount(request.getAdultCount());
        }
        if (request.getChildCount() != null) {
            cartItem.setChildCount(request.getChildCount());
        }
        if (request.getInfantCount() != null) {
            cartItem.setInfantCount(request.getInfantCount());
        }
        if (request.getDepartureDate() != null) {
            cartItem.setDepartureDate(request.getDepartureDate());
        }
        if (request.getDepartureLocation() != null) {
            cartItem.setDepartureLocation(request.getDepartureLocation());
        }
        if (request.getSpecialRequests() != null) {
            cartItem.setSpecialRequests(request.getSpecialRequests());
        }

        // Validate capacity
        validateCapacity(cartItem.getTour(), cartItem);

        CartItemEntity saved = cartItemRepository.save(cartItem);

        // Update cart totals
        CartEntity cart = cartItem.getCart();
        cart.recalculateTotals();
        cartRepository.save(cart);

        return toCartItemResponse(saved);
    }

    @Override
    @Transactional
    public void removeCartItem(Integer cartItemId, Integer userId) {
        CartItemEntity cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new DataNotFoundException("Cart item not found with id: " + cartItemId));

        // Verify ownership
        if (!cartItem.getCart().getUser().getId().equals(userId)) {
            throw new RuntimeException("Cart item does not belong to this user");
        }

        CartEntity cart = cartItem.getCart();
        cart.removeItem(cartItem);
        cartItemRepository.delete(cartItem);
        cartRepository.save(cart);
    }

    @Override
    @Transactional
    public void removeCartItems(List<Integer> cartItemIds, Integer userId) {
        List<CartItemEntity> items = cartItemRepository.findByIdInAndCartUserId(cartItemIds, userId);
        if (!items.isEmpty()) {
            CartEntity cart = items.get(0).getCart();
            for (CartItemEntity item : items) {
                cart.removeItem(item);
            }
            cartItemRepository.deleteAll(items);
            cartRepository.save(cart);
        }
    }

    @Override
    @Transactional
    public void clearCart(Integer userId) {
        CartEntity cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart != null) {
            cartItemRepository.deleteAllByCartId(cart.getId());
            cart.clearItems();
            cartRepository.save(cart);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Integer getCartItemCount(Integer userId) {
        CartEntity cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart == null) {
            return 0;
        }
        return cartItemRepository.countByCartId(cart.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isTourInCart(Integer userId, Integer tourId) {
        return cartItemRepository.findByCartUserIdAndTourId(userId, tourId).isPresent();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CartItemResponse> getCartItemsByIds(List<Integer> cartItemIds, Integer userId) {
        List<CartItemEntity> items = cartItemRepository.findByIdInAndCartUserId(cartItemIds, userId);
        return items.stream()
                .map(this::toCartItemResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public void validateCartItemsForCheckout(List<Integer> cartItemIds, Integer userId) {
        List<CartItemEntity> items = cartItemRepository.findByIdInAndCartUserId(cartItemIds, userId);

        if (items.isEmpty()) {
            throw new RuntimeException("No valid cart items found for checkout");
        }

        if (items.size() != cartItemIds.size()) {
            throw new RuntimeException("Some cart items do not belong to this user or do not exist");
        }

        for (CartItemEntity item : items) {
            TourEntity tour = item.getTour();

            // Check tour status
            if (tour.getStatus() == null || tour.getStatus() != 1) {
                throw new RuntimeException("Tour '" + tour.getName() + "' is not available for booking");
            }

            // Check capacity
            validateCapacity(tour, item);
        }
    }

    // ===================== PRIVATE HELPER METHODS =====================

    private CartEntity getOrCreateCart(Integer userId) {
        return cartRepository.findByUserIdWithItems(userId)
                .orElseGet(() -> {
                    UserEntity user = userRepository.findById(userId)
                            .orElseThrow(() -> new DataNotFoundException("User not found with id: " + userId));

                    CartEntity newCart = new CartEntity();
                    newCart.setUser(user);
                    newCart.setItems(new ArrayList<>());
                    newCart.setTotalItems(0);
                    newCart.setSubtotal(0.0);
                    return cartRepository.save(newCart);
                });
    }

    private void validateCapacity(TourEntity tour, CartItemEntity item) {
        int requestedAdults = item.getAdultCount() != null ? item.getAdultCount() : 0;
        int requestedChildren = item.getChildCount() != null ? item.getChildCount() : 0;
        int requestedInfants = item.getInfantCount() != null ? item.getInfantCount() : 0;

        int availableAdults = tour.getRemainAdult() != null ? tour.getRemainAdult() : 0;
        int availableChildren = tour.getRemainChild() != null ? tour.getRemainChild() : 0;
        int availableInfants = tour.getRemainInfant() != null ? tour.getRemainInfant() : 0;

        if (requestedAdults > availableAdults) {
            throw new RuntimeException("Not enough adult slots available for tour '" + tour.getName() +
                    "'. Available: " + availableAdults + ", Requested: " + requestedAdults);
        }
        if (requestedChildren > availableChildren) {
            throw new RuntimeException("Not enough child slots available for tour '" + tour.getName() +
                    "'. Available: " + availableChildren + ", Requested: " + requestedChildren);
        }
        if (requestedInfants > availableInfants) {
            throw new RuntimeException("Not enough infant slots available for tour '" + tour.getName() +
                    "'. Available: " + availableInfants + ", Requested: " + requestedInfants);
        }
    }

    private CartResponse toCartResponse(CartEntity cart) {
        List<CartItemResponse> itemResponses = cart.getItems() != null
                ? cart.getItems().stream().map(this::toCartItemResponse).collect(Collectors.toList())
                : new ArrayList<>();

        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUser() != null ? cart.getUser().getId() : null)
                .items(itemResponses)
                .totalItems(cart.getTotalItems())
                .subtotal(cart.getSubtotal())
                .createdAt(cart.getCreatedAt())
                .updatedAt(cart.getUpdatedAt())
                .build();
    }

    private CartItemResponse toCartItemResponse(CartItemEntity item) {
        TourEntity tour = item.getTour();
        boolean isAvailable = tour != null && tour.getStatus() != null && tour.getStatus() == 1;

        return CartItemResponse.builder()
                .id(item.getId())
                .cartId(item.getCart() != null ? item.getCart().getId() : null)
                .tourId(tour != null ? tour.getId() : null)
                .tourName(tour != null ? tour.getName() : null)
                .tourAvatar(tour != null ? tour.getAvatar() : null)
                .tourDuration(tour != null ? tour.getDuration() : null)
                .adultCount(item.getAdultCount())
                .childCount(item.getChildCount())
                .infantCount(item.getInfantCount())
                .departureDate(item.getDepartureDate())
                .departureLocation(item.getDepartureLocation())
                .priceAdult(item.getPriceAdult())
                .priceChild(item.getPriceChild())
                .priceInfant(item.getPriceInfant())
                .subtotal(item.getSubtotal())
                .specialRequests(item.getSpecialRequests())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .remainAdult(tour != null ? tour.getRemainAdult() : null)
                .remainChild(tour != null ? tour.getRemainChild() : null)
                .remainInfant(tour != null ? tour.getRemainInfant() : null)
                .isAvailable(isAvailable)
                .build();
    }
}
