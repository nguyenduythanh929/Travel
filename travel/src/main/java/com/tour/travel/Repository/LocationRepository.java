package com.tour.travel.Repository;

import com.tour.travel.Entity.LocationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocationRepository extends JpaRepository<LocationEntity, Integer> {
    List<LocationEntity> findByIdIn(List<Integer> locationIds);
}
