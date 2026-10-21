package com.tour.travel.Service.impl;

import com.tour.travel.Entity.*;
import com.tour.travel.Entity.Enums.BookingStatus;
import com.tour.travel.Entity.Enums.PaymentStatus;
import com.tour.travel.Exceptions.DataNotFoundException;
import com.tour.travel.dto.request.checkout.CheckoutRequest;
import com.tour.travel.dto.request.payment.VNPayPaymentRequest;
import com.tour.travel.dto.response.checkout.CheckoutResponse;
import com.tour.travel.dto.response.payment.VNPayPaymentResponse;
import com.tour.travel.Repository.*;
import com.tour.travel.Service.ICartService;
import com.tour.travel.Service.ICheckoutService;
import com.tour.travel.Service.INotificationService;
import com.tour.travel.Service.IVNPayService;
import com.tour.travel.Service.IVoucherService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;

/**
 * Service implementation for checkout operations.
 * Converts selected cart items to a booking with PENDING_PAYMENT status.
 * Does NOT deduct tour capacity - that happens only after successful payment.
 */
@Service
@RequiredArgsConstructor
public class CheckoutService implements ICheckoutService {

    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;
    private final BookingRepository bookingRepository;
    private final BookingItemRepository bookingItemRepository;
    private final UserRepository userRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final ICartService cartService;
    private final IVoucherService voucherService;
    private final IVNPayService vnPayService;
    private final INotificationService notificationService;

    @Override
    @Transactional
    public CheckoutResponse checkout(CheckoutRequest request, HttpServletRequest httpRequest) {
        cartService.validateCartItemsForCheckout(request.getCartItemIds(), request.getUserId());

        UserEntity user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new DataNotFoundException("User not found with id: " + request.getUserId()));

        List<CartItemEntity> cartItems = cartItemRepository.findByIdInAndCartUserId(
                request.getCartItemIds(), request.getUserId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("No valid cart items found for checkout");
        }

        BookingEntity booking = new BookingEntity();
        booking.setBookingCode(generateBookingCode());
        booking.setUser(user);
        booking.setCustomerName(request.getCustomerName());
        booking.setCustomerPhone(request.getCustomerPhone());
        booking.setCustomerEmail(request.getCustomerEmail());
        booking.setCustomerAddress(request.getCustomerAddress());
        booking.setNote(request.getNote());
        booking.setSpecialRequests(request.getSpecialRequests());

        booking.setStatus(BookingStatus.PENDING_PAYMENT.getValue());
        booking.setPaymentStatus(PaymentStatus.PENDING.getValue());

        int expirationHours = request.getExpirationHours() != null ? request.getExpirationHours() : 24;
        booking.setExpirationTime(LocalDateTime.now().plusHours(expirationHours));

        booking.setCapacityDeducted(false);

        if (request.getPaymentMethodId() != null) {
            PaymentMethodEntity paymentMethod = paymentMethodRepository.findById(request.getPaymentMethodId())
                    .orElseThrow(() -> new DataNotFoundException("Payment method not found"));
            booking.setPaymentMethod(paymentMethod);
        }

        booking = bookingRepository.save(booking);

        double totalPrice = 0.0;
        int totalAdults = 0;
        int totalChildren = 0;
        int totalInfants = 0;

        for (CartItemEntity cartItem : cartItems) {
            BookingItemEntity bookingItem = new BookingItemEntity();
            bookingItem.setBooking(booking);
            bookingItem.setTour(cartItem.getTour());
            bookingItem.setAdultCount(cartItem.getAdultCount());
            bookingItem.setChildCount(cartItem.getChildCount());
            bookingItem.setInfantCount(cartItem.getInfantCount());
            bookingItem.setDepartureDate(cartItem.getDepartureDate());
            bookingItem.setDepartureLocation(cartItem.getDepartureLocation());
            bookingItem.setPriceAdult(cartItem.getPriceAdult());
            bookingItem.setPriceChild(cartItem.getPriceChild());
            bookingItem.setPriceInfant(cartItem.getPriceInfant());
            bookingItem.setSpecialRequests(cartItem.getSpecialRequests());

            bookingItemRepository.save(bookingItem);
            booking.getItems().add(bookingItem);

            totalPrice += cartItem.getSubtotal() != null ? cartItem.getSubtotal() : 0.0;
            totalAdults += cartItem.getAdultCount() != null ? cartItem.getAdultCount() : 0;
            totalChildren += cartItem.getChildCount() != null ? cartItem.getChildCount() : 0;
            totalInfants += cartItem.getInfantCount() != null ? cartItem.getInfantCount() : 0;
        }

        booking.setTotalPrice(totalPrice);
        booking.setTotalAdults(totalAdults);
        booking.setTotalChildren(totalChildren);
        booking.setTotalInfants(totalInfants);

        double discount = 0.0;
        if (request.getVoucherCode() != null && !request.getVoucherCode().isEmpty()) {
            try {
                VoucherEntity voucher = voucherService.validateAndGetVoucher(request.getVoucherCode(), totalPrice);
                discount = voucherService.calculateDiscount(voucher, totalPrice);
                booking.setVoucher(voucher);
                booking.setVoucherCode(request.getVoucherCode());
                booking.setDiscount(discount);
                voucherService.incrementUsageCount(voucher);
            } catch (Exception e) {
                // Voucher invalid - continue without discount
                booking.setDiscount(0.0);
            }
        } else {
            booking.setDiscount(0.0);
        }

        booking.setFinalPrice(totalPrice - discount);

        booking = bookingRepository.save(booking);

        cartService.removeCartItems(request.getCartItemIds(), request.getUserId());

        notificationService.notifyAdminsNewBooking(booking);

        String paymentUrl = null;
        String paymentMethodName = null;
        if (booking.getPaymentMethod() != null) {
            paymentMethodName = booking.getPaymentMethod().getName();

            if ("VNPAY".equalsIgnoreCase(booking.getPaymentMethod().getCode())) {
                VNPayPaymentRequest paymentRequest = new VNPayPaymentRequest();
                paymentRequest.setBookingId(booking.getId());
                paymentRequest.setAmount(booking.getFinalPrice().longValue());
                paymentRequest.setOrderInfo("Payment for booking " + booking.getBookingCode());
                paymentRequest.setReturnUrl(request.getReturnUrl());

                VNPayPaymentResponse paymentResponse = vnPayService.createPayment(paymentRequest, httpRequest);
                if ("00".equals(paymentResponse.getCode())) {
                    paymentUrl = paymentResponse.getPaymentUrl();
                }
            }
        }

        return CheckoutResponse.builder()
                .code("00")
                .message("Checkout successful. Please complete payment within " + expirationHours + " hours.")
                .bookingId(booking.getId())
                .bookingCode(booking.getBookingCode())
                .status(BookingStatus.PENDING_PAYMENT.name())
                .statusDescription(BookingStatus.PENDING_PAYMENT.getDescription())
                .totalPrice(booking.getTotalPrice())
                .discount(booking.getDiscount())
                .finalPrice(booking.getFinalPrice())
                .voucherCode(booking.getVoucherCode())
                .expirationTime(booking.getExpirationTime())
                .createdAt(booking.getCreatedAt())
                .paymentUrl(paymentUrl)
                .paymentMethod(paymentMethodName)
                .customerName(booking.getCustomerName())
                .customerPhone(booking.getCustomerPhone())
                .customerEmail(booking.getCustomerEmail())
                .totalAdults(booking.getTotalAdults())
                .totalChildren(booking.getTotalChildren())
                .totalInfants(booking.getTotalInfants())
                .itemCount(booking.getItems().size())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public CheckoutResponse getCheckoutSummary(CheckoutRequest request) {
        cartService.validateCartItemsForCheckout(request.getCartItemIds(), request.getUserId());

        List<CartItemEntity> cartItems = cartItemRepository.findByIdInAndCartUserId(
                request.getCartItemIds(), request.getUserId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("No valid cart items found");
        }

        double totalPrice = 0.0;
        int totalAdults = 0;
        int totalChildren = 0;
        int totalInfants = 0;

        for (CartItemEntity cartItem : cartItems) {
            totalPrice += cartItem.getSubtotal() != null ? cartItem.getSubtotal() : 0.0;
            totalAdults += cartItem.getAdultCount() != null ? cartItem.getAdultCount() : 0;
            totalChildren += cartItem.getChildCount() != null ? cartItem.getChildCount() : 0;
            totalInfants += cartItem.getInfantCount() != null ? cartItem.getInfantCount() : 0;
        }

        double discount = 0.0;
        String voucherCode = null;
        if (request.getVoucherCode() != null && !request.getVoucherCode().isEmpty()) {
            try {
                VoucherEntity voucher = voucherService.validateAndGetVoucher(request.getVoucherCode(), totalPrice);
                discount = voucherService.calculateDiscount(voucher, totalPrice);
                voucherCode = request.getVoucherCode();
            } catch (Exception e) {
                // Voucher invalid - continue without discount
            }
        }

        int expirationHours = request.getExpirationHours() != null ? request.getExpirationHours() : 24;

        return CheckoutResponse.builder()
                .code("00")
                .message("Checkout summary")
                .status(BookingStatus.PENDING_PAYMENT.name())
                .statusDescription(BookingStatus.PENDING_PAYMENT.getDescription())
                .totalPrice(totalPrice)
                .discount(discount)
                .finalPrice(totalPrice - discount)
                .voucherCode(voucherCode)
                .expirationTime(LocalDateTime.now().plusHours(expirationHours))
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .customerEmail(request.getCustomerEmail())
                .totalAdults(totalAdults)
                .totalChildren(totalChildren)
                .totalInfants(totalInfants)
                .itemCount(cartItems.size())
                .build();
    }

    /**
     * Generate a unique booking code.
     * Format: BK + YYMMDD + 6 random alphanumeric characters
     */
    private String generateBookingCode() {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        String randomPart = generateRandomString(6);
        return "BK" + datePart + randomPart;
    }

    private String generateRandomString(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
