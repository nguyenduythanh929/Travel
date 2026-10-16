package com.tour.travel.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tours")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class TourEntity extends BaseEntity {

    private String name;
    private String avatar;

    @Column(name = "price_adult")
    private Double priceAdult;

    @Column(name = "price_child")
    private Double priceChild;

    @Column(name = "price_infant")
    private Double priceInfant;

    private String transport;

    private String trailer;

    @Column(name = "tour_detail")
    private String tourDetail;

    private String note;

    @Column(name = "map_url")
    private String mapUrl;

    private Integer status;

    private Integer duration;

    @Column(name = "remain_adult")
    private Integer remainAdult;

    @Column(name = "remain_child")
    private Integer remainChild;

    @Column(name = "remain_infant")
    private Integer remainInfant;

    @Column(name = "embedding", columnDefinition = "TEXT")
    private String embedding;

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TourImageEntity> images = new ArrayList<>();

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookingItemEntity> items = new ArrayList<>();

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TourScheduleEntity> tourSchedules = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_type_id")
    private TourTypeEntity tourType;

    @ManyToMany
    @JoinTable(
            name = "tour_departure_date",
            joinColumns = @JoinColumn(name = "tour_id"),
            inverseJoinColumns = @JoinColumn(name = "departure_date_id")
    )
    private List<DepartureDateEntity> departureDates = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "tour_location",
            joinColumns = @JoinColumn(name = "tour_id"),
            inverseJoinColumns = @JoinColumn(name = "location_id")
    )
    private List<LocationEntity> locations = new ArrayList<>();

    @ManyToMany(mappedBy = "tours", fetch = FetchType.LAZY)
    private List<PromotionEntity> promotions;

    public PromotionEntity getActivePromotion() {
        if (promotions == null || promotions.isEmpty()) {
            return null;
        }

        return promotions.stream()
                .filter(PromotionEntity::isActive)
                .max((p1, p2) -> p1.getDiscount().compareTo(p2.getDiscount()))
                .orElse(null);
    }
}
