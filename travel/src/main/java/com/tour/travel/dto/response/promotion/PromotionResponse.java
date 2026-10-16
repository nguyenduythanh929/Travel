package com.tour.travel.dto.response.promotion;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromotionResponse {
    private Integer id;
    private String name;
    private Integer discount;
    private String discountType;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String description;
    private Integer status;
    private Boolean isActive;
    private Integer tourCount;
    private List<String> tourNames;
    private String createdBy;
    private LocalDateTime createdAt;
}