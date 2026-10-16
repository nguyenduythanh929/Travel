package com.tour.travel.Converter;

import com.tour.travel.Entity.BookingEntity;
import com.tour.travel.Entity.UserEntity;
import com.tour.travel.Entity.VoucherEntity;
import com.tour.travel.Exceptions.DataNotFoundException;
import com.tour.travel.dto.request.booking.BookingRequest;
import com.tour.travel.dto.response.booking.BookingItemResponse;
import com.tour.travel.dto.response.booking.BookingResponse;
import com.tour.travel.dto.response.payment.PaymentMethodResponse;
import com.tour.travel.dto.response.voucher.VoucherResponse;
import com.tour.travel.Repository.PaymentMethodRepository;
import com.tour.travel.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class BookingConverter {

    private final UserRepository userRepository;
    private final BookingItemConverter bookingItemConverter;
    private final PaymentMethodRepository paymentMethodRepository;

    public BookingEntity toEntity(BookingRequest request) {
        BookingEntity booking = new BookingEntity();

        UserEntity user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new DataNotFoundException("User not found with id: " + request.getUserId()));
        booking.setUser(user);
        booking.setItems(new ArrayList<>());

        booking.setTotalPrice(0.0);
        booking.setFinalPrice(0.0);
        booking.setDiscount(0.0);
        booking.setCustomerName(request.getCustomerName());
        booking.setCustomerPhone(request.getCustomerPhone());
        booking.setPaymentStatus(request.getPaymentStatus());
        booking.setNote(request.getNote());
        return booking;
    }

    public BookingResponse toResponse(BookingEntity bookingEntity) {
        if (bookingEntity == null) return null;

        // Handle items with null safety
        List<BookingItemResponse> itemResponses = bookingEntity.getItems() != null
                ? bookingEntity.getItems().stream()
                    .map(bookingItemConverter::toResponse)
                    .toList()
                : Collections.emptyList();

        // Get payment methods
        List<PaymentMethodResponse> methods = paymentMethodRepository.findAll()
                .stream()
                .map(method -> new PaymentMethodResponse(
                        method.getId(),
                        method.getName()
                ))
                .toList();

        // Handle null values for prices
        double totalPrice = bookingEntity.getTotalPrice() != null ? bookingEntity.getTotalPrice() : 0.0;
        double discount = bookingEntity.getDiscount() != null ? bookingEntity.getDiscount() : 0.0;
        double finalPrice = bookingEntity.getFinalPrice() != null ? bookingEntity.getFinalPrice() : 0.0;

        // Build voucher response if voucher exists
        VoucherResponse voucherResponse = null;
        if (bookingEntity.getVoucher() != null) {
            VoucherEntity voucher = bookingEntity.getVoucher();
            voucherResponse = VoucherResponse.builder()
                    .id(voucher.getId())
                    .code(voucher.getCode())
                    .description(voucher.getDescription())
                    .discountType(voucher.getDiscountType() != null ? voucher.getDiscountType().toString() : null)
                    .discountValue(voucher.getDiscountValue())
                    .minPurchaseAmount(voucher.getMinPurchaseAmount())
                    .maxDiscountAmount(voucher.getMaxDiscountAmount())
                    .validFrom(voucher.getValidFrom())
                    .validTo(voucher.getValidTo())
                    .usageLimit(voucher.getUsageLimit())
                    .usageCount(voucher.getUsageCount())
                    .isActive(voucher.getIsActive())
                    .build();
        }

        return BookingResponse.builder()
                .id(bookingEntity.getId())
                .bookingCode(bookingEntity.getBookingCode())
                .userId(bookingEntity.getUser() != null ? bookingEntity.getUser().getId() : null)
                .items(itemResponses)
                .totalPrice(totalPrice)
                .discount(discount)
                .finalPrice(finalPrice)
                .voucherCode(bookingEntity.getVoucherCode())
                .voucher(voucherResponse)
                .customerName(bookingEntity.getCustomerName())
                .customerPhone(bookingEntity.getCustomerPhone())
                .customerEmail(bookingEntity.getCustomerEmail())
                .customerAddress(bookingEntity.getCustomerAddress())
                .note(bookingEntity.getNote())
                .specialRequests(bookingEntity.getSpecialRequests())
                .paymentStatus(bookingEntity.getPaymentStatus())
                .paymentMethods(methods)
                .status(bookingEntity.getStatus())
                .expirationTime(bookingEntity.getExpirationTime())
                .paidAt(bookingEntity.getPaidAt())
                .completedAt(bookingEntity.getCompletedAt())
                .cancelledAt(bookingEntity.getCancelledAt())
                .cancellationReason(bookingEntity.getCancellationReason())
                .cancelledBy(bookingEntity.getCancelledBy())
                .confirmedByStaff(bookingEntity.getConfirmedByStaff())
                .totalAdults(bookingEntity.getTotalAdults() != null ? bookingEntity.getTotalAdults() : 0)
                .totalChildren(bookingEntity.getTotalChildren() != null ? bookingEntity.getTotalChildren() : 0)
                .totalInfants(bookingEntity.getTotalInfants() != null ? bookingEntity.getTotalInfants() : 0)
                .capacityDeducted(bookingEntity.getCapacityDeducted())
                .build();
    }
}
