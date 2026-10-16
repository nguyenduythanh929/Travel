package com.tour.travel.Repository;

import com.tour.travel.Entity.DepartureDateEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DepartureDateRepository extends JpaRepository<DepartureDateEntity, Integer> {
    Optional<DepartureDateEntity> findById(Integer id);
    List<DepartureDateEntity> findAllByDate(LocalDate date);
}
