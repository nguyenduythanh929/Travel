package com.tour.travel.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "departure_dates")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class DepartureDateEntity extends BaseEntity{

    private LocalDate date;

    private Integer status;

    @ManyToMany(mappedBy = "departureDates")
    private List<TourEntity> tours = new ArrayList<>();
}

