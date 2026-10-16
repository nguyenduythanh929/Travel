package com.tour.travel.dto.response.booking;

import com.tour.travel.dto.response.common.BaseResponse;
import com.tour.travel.dto.response.payment.PaymentMethodResponse;
import com.tour.travel.dto.response.voucher.VoucherResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse extends BaseResponse {
    private Integer id;
    private String bookingCode;
    private Integer userId;
    private List<BookingItemResponse> items;
    private Double totalPrice;
    private Double discount;
    private Double finalPrice;
    private String voucherCode;
    private VoucherResponse voucher;
    private List<PaymentMethodResponse> paymentMethods;
    private Integer paymentStatus;
    private String paymentStatusDescription;
    private String paymentMethodName;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String customerAddress;
    private Integer status;
    private String statusDescription;
    private String note;
    private String specialRequests;

    // Timestamps
    private LocalDateTime expirationTime;
    private LocalDateTime paidAt;
    private LocalDateTime completedAt;
    private LocalDateTime cancelledAt;

    // Cancellation info
    private String cancellationReason;
    private String cancelledBy;

    // Staff info (for cash payment confirmation)
    private String confirmedByStaff;

    // Summary totals
    private Integer totalAdults;
    private Integer totalChildren;
    private Integer totalInfants;
    private Integer totalPassengers;

    // Capacity tracking
    private Boolean capacityDeducted;

    // Helper flags
    private Boolean isExpired;
    private Boolean canCancel;
    private Boolean canPay;
}

