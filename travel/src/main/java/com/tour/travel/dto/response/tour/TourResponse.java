package com.tour.travel.dto.response.tour;


import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourResponse {
    private Integer id;
    private String name;
    private String imageUrl;
    private Double originalPrice;
    private Double discountedPrice;
    private Integer discountPercent;
    private Boolean isOnSale;
    private LocalDate startDate;
    private String duration;
    private Integer remainSlot;
    private Double rating;
    private Long reviewCount;
    private String promotionName;
    private Integer status;
    private Double priceAdult;
    private Double priceChild;
    private Double priceInfant;
    private Integer remainAdult;
    private Integer remainChild;
    private Integer remainInfant;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
}
