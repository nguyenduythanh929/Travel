package com.tour.travel.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tour_types")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class TourTypeEntity extends BaseEntity {

    private String name;

    @Column(unique = true, length = 100)
    private String value;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "parent_id")
    private Integer parentId;

    private Integer status;

    @OneToMany(mappedBy = "tourType", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TourEntity> tours = new ArrayList<>();
}

