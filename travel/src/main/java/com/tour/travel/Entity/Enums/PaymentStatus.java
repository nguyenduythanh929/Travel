package com.tour.travel.Entity.Enums;

import lombok.Getter;

@Getter
public enum PaymentStatus {
    PENDING(0, "Pending"),
    SUCCESS(1, "Success"),
    FAILED(2, "Failed"),
    REFUNDED(3, "Refunded");

    private final int value;
    private final String description;

    PaymentStatus(int value, String description) {
        this.value = value;
        this.description = description;
    }

    public static PaymentStatus fromValue(int value) {
        for (PaymentStatus status : PaymentStatus.values()) {
            if (status.value == value) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown payment status value: " + value);
    }
}
