package com.tour.travel.Repository;

import com.tour.travel.Entity.TourTypeEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface TourTypeRepository extends JpaRepository<TourTypeEntity, Integer> {
    @Query("""
    SELECT t FROM TourTypeEntity t
    WHERE (:name IS NULL OR :name = '' OR LOWER(t.name) LIKE LOWER(CONCAT('%', :name, '%')))
      AND (:status IS NULL OR t.status = :status)
      AND (:createdBy IS NULL OR :createdBy = '' OR LOWER(t.createdBy) = LOWER(:createdBy))
      AND (:startDate IS NULL OR t.createdAt >= :startDate)
      AND (:endDate IS NULL OR t.createdAt <= :endDate)
""")
    Page<TourTypeEntity> searchTourTypes(
            @Param("name") String name,
            @Param("status") Integer status,
            @Param("createdBy") String createdBy,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );
}
