package com.tour.travel.dto.response.cart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {

    private Integer id;
    private Integer userId;
    private List<CartItemResponse> items;
    private Integer totalItems;
    private Double subtotal;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
