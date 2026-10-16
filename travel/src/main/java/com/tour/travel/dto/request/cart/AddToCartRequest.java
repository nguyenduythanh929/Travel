package com.tour.travel.dto.request.cart;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddToCartRequest {

    @NotNull(message = "Tour ID is required")
    private Integer tourId;

    @NotNull(message = "User ID is required")
    private Integer userId;

    @Min(value = 0, message = "Adult count must be at least 0")
    private Integer adultCount = 0;

    @Min(value = 0, message = "Child count must be at least 0")
    private Integer childCount = 0;

    @Min(value = 0, message = "Infant count must be at least 0")
    private Integer infantCount = 0;

    private LocalDate departureDate;

    private String departureLocation;

    private String specialRequests;
}
