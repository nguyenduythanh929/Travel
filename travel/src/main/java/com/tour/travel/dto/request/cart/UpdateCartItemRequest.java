package com.tour.travel.dto.request.cart;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCartItemRequest {

    @Min(value = 0, message = "Adult count must be at least 0")
    private Integer adultCount;

    @Min(value = 0, message = "Child count must be at least 0")
    private Integer childCount;

    @Min(value = 0, message = "Infant count must be at least 0")
    private Integer infantCount;

    private LocalDate departureDate;

    private String departureLocation;

    private String specialRequests;
}
