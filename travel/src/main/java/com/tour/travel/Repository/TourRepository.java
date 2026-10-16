package com.tour.travel.Repository;

import com.tour.travel.Entity.TourEntity;
import com.tour.travel.Repository.Custom.TourRepositoryCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TourRepository extends JpaRepository<TourEntity, Integer>, TourRepositoryCustom {
    Page<TourEntity> findAll(Pageable pageable);

    Page<TourEntity> findByTourType_ParentId(Integer parentId, Pageable pageable);

    Optional<TourEntity> findById(Integer id);

    Page<TourEntity> findByNameContainingIgnoreCase(String keyword, PageRequest pageRequest);
}
