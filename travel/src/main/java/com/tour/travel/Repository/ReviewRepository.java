package com.tour.travel.Repository;


import com.tour.travel.Entity.ReviewEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Integer> {

    Page<ReviewEntity> findByTourIdAndStatus(Integer tourId, Integer status, Pageable pageable);

    List<ReviewEntity> findByTourIdAndStatus(Integer tourId, Integer status);

    Page<ReviewEntity> findByUserIdAndStatus(Integer userId, Integer status, Pageable pageable);

    boolean existsByTourIdAndUserId(Integer tourId, Integer userId);

    Optional<ReviewEntity> findByTourIdAndUserId(Integer tourId, Integer userId);

    @Query("SELECT AVG(r.rating) FROM ReviewEntity r WHERE r.tour.id = :tourId AND r.status = 1")
    Double getAverageRatingByTourId(@Param("tourId") Integer tourId);

    long countByTourIdAndStatus(Integer tourId, Integer status);

    Page<ReviewEntity> findByTourIdAndStatusAndRating(Integer tourId, Integer status, Integer rating, Pageable pageable);

    Page<ReviewEntity> findByStatusOrderByCreatedAtDesc(Integer status, Pageable pageable);
}
