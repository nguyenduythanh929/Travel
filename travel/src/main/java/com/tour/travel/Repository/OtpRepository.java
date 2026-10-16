package com.tour.travel.Repository;

import com.tour.travel.Entity.OtpEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpEntity, Integer> {

    Optional<OtpEntity> findByEmailAndOtpCodeAndIsUsedFalseAndExpiryTimeAfter(
            String email,
            String otpCode,
            LocalDateTime currentTime
    );

    void deleteByEmail(String email);
}