package com.tour.travel.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "vnpay_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VNPayTransactionEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private BookingEntity booking;

    @Column(name = "vnp_txn_ref", unique = true, nullable = false)
    private String vnpTxnRef;

    @Column(name = "vnp_amount")
    private Long vnpAmount;

    @Column(name = "vnp_bank_code")
    private String vnpBankCode;

    @Column(name = "vnp_order_info")
    private String vnpOrderInfo;

    @Column(name = "vnp_transaction_no")
    private String vnpTransactionNo;

    @Column(name = "vnp_response_code")
    private String vnpResponseCode;

    @Column(name = "vnp_transaction_status")
    private String vnpTransactionStatus;

    @Column(name = "vnp_pay_date")
    private String vnpPayDate;

    @Column(name = "vnp_card_type")
    private String vnpCardType;

    @Column(name = "payment_url", length = 2000)
    private String paymentUrl;

    @Column(name = "status")
    private Integer status;

    @Column(name = "payment_time")
    private LocalDateTime paymentTime;

    @Column(name = "ip_address")
    private String ipAddress;
}
