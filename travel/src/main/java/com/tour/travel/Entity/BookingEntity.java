package com.tour.travel.Entity;

import com.tour.travel.Entity.Enums.BookingStatus;
import com.tour.travel.Entity.Enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Booking Entity - Created at checkout from cart items
 * Follows real-world tourism business standards:
 * - Starts with PENDING_PAYMENT status
 * - Supports online payment (VNPay) and cash (offline) payment
 * - Tour capacity deducted only after successful payment
 * - Automatic expiration handling for unpaid bookings
 */
@Entity
@Table(name = "bookings", indexes = {
    @Index(name = "idx_booking_user", columnList = "user_id"),
    @Index(name = "idx_booking_status", columnList = "status"),
    @Index(name = "idx_booking_expiration", columnList = "expiration_time"),
    @Index(name = "idx_booking_code", columnList = "booking_code")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingEntity extends BaseEntity {

    @Column(name = "booking_code", unique = true, length = 20)
    private String bookingCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_method_id")
    private PaymentMethodEntity paymentMethod;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id")
    private VoucherEntity voucher;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookingItemEntity> items = new ArrayList<>();

    @Column(name = "total_price")
    private Double totalPrice;

    @Column(name = "final_price")
    private Double finalPrice;

    private Double discount;

    @Column(name = "voucher_code", length = 50)
    private String voucherCode;

    // Booking status: PENDING_PAYMENT(1), PAID(2), COMPLETED(3), CANCELLED(4), EXPIRED(5)
    private Integer status = BookingStatus.PENDING_PAYMENT.getValue();

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "customer_phone")
    private String customerPhone;

    @Column(name = "customer_email")
    private String customerEmail;

    @Column(name = "customer_address")
    private String customerAddress;

    // Payment status: PENDING(0), SUCCESS(1), FAILED(2), REFUNDED(3)
    @Column(name = "payment_status")
    private Integer paymentStatus = PaymentStatus.PENDING.getValue();

    private String note;

    // Expiration time for PENDING_PAYMENT bookings (e.g., 24 hours from creation)
    @Column(name = "expiration_time")
    private LocalDateTime expirationTime;

    // Timestamp when payment was confirmed (online or cash)
    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    // Timestamp when booking was marked as completed (after tour ends)
    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    // Timestamp when booking was cancelled
    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    // Reason for cancellation (if cancelled)
    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    // Who cancelled the booking (USER, ADMIN, SYSTEM)
    @Column(name = "cancelled_by", length = 50)
    private String cancelledBy;

    // Staff who confirmed cash payment (for offline payments)
    @Column(name = "confirmed_by_staff")
    private String confirmedByStaff;

    // Number of adults in all items (for quick reference)
    @Column(name = "total_adults")
    private Integer totalAdults = 0;

    // Number of children in all items
    @Column(name = "total_children")
    private Integer totalChildren = 0;

    // Number of infants in all items
    @Column(name = "total_infants")
    private Integer totalInfants = 0;

    // Whether tour capacity has been deducted (only after payment)
    @Column(name = "capacity_deducted")
    private Boolean capacityDeducted = false;

    // Special requests from customer
    @Column(name = "special_requests", columnDefinition = "TEXT")
    private String specialRequests;

    public void addItem(BookingItemEntity item) {
        items.add(item);
        item.setBooking(this);
        recalculateTotals();
    }

    public void removeItem(BookingItemEntity item) {
        items.remove(item);
        item.setBooking(null);
        recalculateTotals();
    }

    public void recalculateTotals() {
        this.totalAdults = items.stream()
                .mapToInt(item -> item.getAdultCount() != null ? item.getAdultCount() : 0)
                .sum();
        this.totalChildren = items.stream()
                .mapToInt(item -> item.getChildCount() != null ? item.getChildCount() : 0)
                .sum();
        this.totalInfants = items.stream()
                .mapToInt(item -> item.getInfantCount() != null ? item.getInfantCount() : 0)
                .sum();
        this.totalPrice = items.stream()
                .mapToDouble(item -> item.getSubtotal() != null ? item.getSubtotal() : 0.0)
                .sum();
        this.finalPrice = totalPrice - (discount != null ? discount : 0.0);
    }

    public int getTotalPassengers() {
        return (totalAdults != null ? totalAdults : 0) +
               (totalChildren != null ? totalChildren : 0) +
               (totalInfants != null ? totalInfants : 0);
    }

    public boolean isExpired() {
        return expirationTime != null && LocalDateTime.now().isAfter(expirationTime);
    }

    public boolean isPendingPayment() {
        return status != null && status == BookingStatus.PENDING_PAYMENT.getValue();
    }

    public boolean isPaid() {
        return status != null && status == BookingStatus.PAID.getValue();
    }

    public boolean isCancelled() {
        return status != null && status == BookingStatus.CANCELLED.getValue();
    }

    public boolean isCompleted() {
        return status != null && status == BookingStatus.COMPLETED.getValue();
    }

    public BookingStatus getBookingStatus() {
        return status != null ? BookingStatus.fromValue(status) : BookingStatus.PENDING_PAYMENT;
    }

    public PaymentStatus getPaymentStatusEnum() {
        return paymentStatus != null ? PaymentStatus.fromValue(paymentStatus) : PaymentStatus.PENDING;
    }
}

