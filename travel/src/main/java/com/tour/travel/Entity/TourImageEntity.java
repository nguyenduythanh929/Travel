package com.tour.travel.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tour_image")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TourImageEntity extends BaseEntity{
    public static final int MAXIMUM_IMAGES_PER_TOUR = 5;

    private String url;
    private String name;
    private Integer status;

    @Column(name = "is_banner")
    private Integer isBanner;

    @ManyToOne
    @JoinColumn(name = "tour_id")
    private TourEntity tour;
}
