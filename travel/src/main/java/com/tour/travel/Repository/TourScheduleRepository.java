package com.tour.travel.Repository;

import com.tour.travel.Entity.TourScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TourScheduleRepository extends JpaRepository<TourScheduleEntity, Integer> {
    List<TourScheduleEntity> findByTour_IdOrderByIdAsc(Integer tourId);
}
