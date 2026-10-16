package com.tour.travel.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "locations")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class LocationEntity extends BaseEntity {


    private String name;
    private Integer status;

    @Column(name = "country_id")
    private Integer countryId;

    @ManyToMany(mappedBy = "locations")
    private List<TourEntity> tours = new ArrayList<>();
}
