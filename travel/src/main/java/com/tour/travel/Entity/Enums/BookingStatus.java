package com.tour.travel.Entity.Enums;

import lombok.Getter;

@Getter
public enum BookingStatus {
    PENDING_PAYMENT(1, "Pending Payment"),
    PAID(2, "Paid"),
    COMPLETED(3, "Completed"),
    CANCELLED(4, "Cancelled"),
    EXPIRED(5, "Expired");

    private final int value;
    private final String description;

    BookingStatus(int value, String description) {
        this.value = value;
        this.description = description;
    }

    public static BookingStatus fromValue(int value) {
        for (BookingStatus status : BookingStatus.values()) {
            if (status.value == value) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown booking status value: " + value);
    }
}
