package com.tour.travel.dto.response.cart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {

    private Integer id;
    private Integer cartId;
    private Integer tourId;
    private String tourName;
    private String tourAvatar;
    private Integer tourDuration;
    private Integer adultCount;
    private Integer childCount;
    private Integer infantCount;
    private LocalDate departureDate;
    private String departureLocation;
    private Double priceAdult;
    private Double priceChild;
    private Double priceInfant;
    private Double subtotal;
    private String specialRequests;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Tour availability info
    private Integer remainAdult;
    private Integer remainChild;
    private Integer remainInfant;
    private Boolean isAvailable;
}
