package com.tour.travel.Repository;

import com.tour.travel.Entity.PromotionEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<PromotionEntity, Integer> {

    List<PromotionEntity> findByStatusOrderByCreatedAtDesc(Integer status);

    @Query("SELECT p FROM PromotionEntity p JOIN p.tours t " +
            "WHERE t.id = :tourId AND p.status = 1 " +
            "AND (p.startDate IS NULL OR p.startDate <= :now) " +
            "AND (p.endDate IS NULL OR p.endDate >= :now)")
    List<PromotionEntity> findActivePromotionsByTourId(
            @Param("tourId") Integer tourId,
            @Param("now") LocalDateTime now
    );

    @Query("SELECT p FROM PromotionEntity p JOIN p.tours t " +
            "WHERE t.id = :tourId AND p.status = 1 " +
            "AND (p.startDate IS NULL OR p.startDate <= :now) " +
            "AND (p.endDate IS NULL OR p.endDate >= :now) " +
            "ORDER BY p.discount DESC")
    Optional<PromotionEntity> findBestPromotionForTour(
            @Param("tourId") Integer tourId,
            @Param("now") LocalDateTime now
    );

    Page<PromotionEntity> findByNameContainingIgnoreCaseOrderByCreatedAtDesc(
            String name, Pageable pageable);

    @Query("SELECT COUNT(t) FROM TourEntity t JOIN t.promotions p WHERE p.id = :promotionId")
    Long countToursInPromotion(@Param("promotionId") Integer promotionId);

    @Query("SELECT p FROM PromotionEntity p " +
            "WHERE p.status = 1 " +
            "AND (p.startDate IS NULL OR p.startDate <= :now) " +
            "AND (p.endDate IS NULL OR p.endDate >= :now)")
    List<PromotionEntity> findAllActivePromotions(@Param("now") LocalDateTime now);
}
