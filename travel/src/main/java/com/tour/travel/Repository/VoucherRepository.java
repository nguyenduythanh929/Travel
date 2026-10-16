package com.tour.travel.Repository;

import com.tour.travel.Entity.VoucherEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface VoucherRepository extends JpaRepository<VoucherEntity, Integer> {

    Optional<VoucherEntity> findByCode(String code);

    @Query("""
        SELECT v FROM VoucherEntity v
        WHERE v.code = :code
          AND v.isActive = true
          AND v.validFrom <= :now
          AND v.validTo >= :now
          AND (v.usageLimit IS NULL OR v.usageCount < v.usageLimit)
        """)
    Optional<VoucherEntity> findValidVoucherByCode(
            @Param("code") String code,
            @Param("now") LocalDateTime now
    );

    boolean existsByCode(String code);
}
