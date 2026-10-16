package com.tour.travel.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "booking_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingItemEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private BookingEntity booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id")
    private TourEntity tour;

    @Column(name = "adult_count")
    private Integer adultCount;

    @Column(name = "child_count")
    private Integer childCount;

    @Column(name = "infant_count")
    private Integer infantCount;

    @Column(name = "departure_date")
    private LocalDate departureDate;

    @Column(name = "departure_location")
    private String departureLocation;

    private Double subtotal;

    @Column(name = "price_adult")
    private Double priceAdult;

    @Column(name = "price_child")
    private Double priceChild;

    @Column(name = "price_infant")
    private Double priceInfant;

    @Column(name = "special_requests", columnDefinition = "TEXT")
    private String specialRequests;

    @PrePersist
    @PreUpdate
    public void calculateSubtotal() {
        double adultTotal = (priceAdult != null ? priceAdult : 0.0) * (adultCount != null ? adultCount : 0);
        double childTotal = (priceChild != null ? priceChild : 0.0) * (childCount != null ? childCount : 0);
        double infantTotal = (priceInfant != null ? priceInfant : 0.0) * (infantCount != null ? infantCount : 0);
        this.subtotal = adultTotal + childTotal + infantTotal;
    }

    public int getTotalPassengers() {
        return (adultCount != null ? adultCount : 0) +
               (childCount != null ? childCount : 0) +
               (infantCount != null ? infantCount : 0);
    }
}

