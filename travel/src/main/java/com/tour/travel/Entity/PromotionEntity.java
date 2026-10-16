package com.tour.travel.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "promotions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PromotionEntity extends BaseEntity {

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false)
    private Integer discount;

    @Column(name = "discount_type", length = 50)
    private String discountType;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    private Integer status;

    @ManyToMany
    @JoinTable(
            name = "tour_promotion",
            joinColumns = @JoinColumn(name = "promotion_id"),
            inverseJoinColumns = @JoinColumn(name = "tour_id")
    )
    private List<TourEntity> tours = new ArrayList<>();

    public boolean isActive() {
        if (status == null || status != 1) {
            return false;
        }
        LocalDateTime now = LocalDateTime.now();
        if (startDate != null && now.isBefore(startDate)) {
            return false;
        }
        return endDate == null || !now.isAfter(endDate);
    }

    public Double calculateDiscountedPrice(Double originalPrice) {
        if (originalPrice == null || !isActive()) {
            return originalPrice;
        }

        if ("FIXED_AMOUNT".equals(discountType)) {
            return Math.max(0, originalPrice - discount);
        } else {
            double result = originalPrice * (100 - discount) / 100.0;
            return Math.round(result * 100.0) / 100.0;
        }
    }
}
