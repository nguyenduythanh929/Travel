package com.tour.travel.Repository;

import com.tour.travel.Entity.TourImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TourImageRepository extends JpaRepository<TourImageEntity, Integer> {
    List<TourImageEntity> findByTour_Id(Integer tourId);
    void deleteByTour_Id(Integer id);
}
