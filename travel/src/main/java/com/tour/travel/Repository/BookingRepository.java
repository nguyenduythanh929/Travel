package com.tour.travel.Repository;

import com.tour.travel.Entity.BookingEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<BookingEntity, Integer> {


    @Query("""
        SELECT b FROM BookingEntity b
        WHERE (:keyword IS NULL OR LOWER(b.customerName) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(b.customerPhone) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(b.bookingCode) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:status IS NULL OR b.status = :status)
          AND (:paymentStatus IS NULL OR b.paymentStatus = :paymentStatus)
          AND (:paymentMethodId IS NULL OR b.paymentMethod.id = :paymentMethodId)
          AND (:startDate IS NULL OR b.createdAt >= :startDate)
          AND (:endDate IS NULL OR b.createdAt <= :endDate)
        """)
    Page<BookingEntity> searchBookings(
            @Param("keyword") String keyword,
            @Param("status") Integer status,
            @Param("paymentStatus") Integer paymentStatus,
            @Param("paymentMethodId") Integer paymentMethodId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );


    Optional<BookingEntity> findByBookingCode(String bookingCode);


    Optional<BookingEntity> findByUser_IdAndStatus(Integer userId, Integer status);

    List<BookingEntity> findAllByUser_IdAndStatusNot(Integer userId, Integer status);

    List<BookingEntity> findAllByUser_Id(Integer userId);

    Page<BookingEntity> findByUserId(Integer userId, Pageable pageable);


    Page<BookingEntity> findByStatus(Integer status, Pageable pageable);

    List<BookingEntity> findByStatus(Integer status);


    /**
     * Find bookings that are PENDING_PAYMENT and past expiration time.
     */
    @Query("""
        SELECT b FROM BookingEntity b
        WHERE b.status = :status
          AND b.expirationTime IS NOT NULL
          AND b.expirationTime < :now
        """)
    List<BookingEntity> findExpiredPendingPaymentBookings(
            @Param("status") Integer status,
            @Param("now") LocalDateTime now
    );

    /**
     * Find bookings expiring within specified time.
     */
    @Query("""
        SELECT b FROM BookingEntity b
        WHERE b.status = :status
          AND b.expirationTime IS NOT NULL
          AND b.expirationTime > :now
          AND b.expirationTime < :expirationThreshold
        """)
    Page<BookingEntity> findBookingsExpiringSoon(
            @Param("status") Integer status,
            @Param("now") LocalDateTime now,
            @Param("expirationThreshold") LocalDateTime expirationThreshold,
            Pageable pageable
    );


    /**
     * Find PAID bookings that might be completed.
     * Completion is determined by checking if all tour end dates have passed.
     */
    @Query("SELECT b FROM BookingEntity b WHERE b.status = :status")
    List<BookingEntity> findPaidBookings(@Param("status") Integer status);


    @Query("SELECT COALESCE(SUM(b.finalPrice), 0.0) FROM BookingEntity b WHERE b.paymentStatus = :paymentStatus")
    Double getTotalRevenue(@Param("paymentStatus") Integer paymentStatus);

    @Query("""
        SELECT CAST(b.createdAt AS LocalDate) as date, SUM(b.finalPrice) as revenue
        FROM BookingEntity b
        WHERE b.paymentStatus = :paymentStatus
          AND (:startDate IS NULL OR b.createdAt >= :startDate)
          AND (:endDate IS NULL OR b.createdAt <= :endDate)
        GROUP BY CAST(b.createdAt AS LocalDate)
        ORDER BY CAST(b.createdAt AS LocalDate)
        """)
    List<Object[]> getRevenueByDate(
            @Param("paymentStatus") Integer paymentStatus,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );


    @Query("""
        SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END
        FROM BookingEntity b
        JOIN b.items bi
        WHERE b.user.id = :userId
        AND bi.tour.id = :tourId
        AND b.status = :completedStatus
        """)
    boolean existsCompletedBookingForUserAndTour(
            @Param("userId") Integer userId,
            @Param("tourId") Integer tourId,
            @Param("completedStatus") Integer completedStatus
    );


    @Modifying
    @Query("""
        UPDATE BookingEntity b
        SET b.status = :newStatus, b.cancelledAt = :now, b.cancelledBy = 'SYSTEM'
        WHERE b.status = :pendingStatus
          AND b.expirationTime IS NOT NULL
          AND b.expirationTime < :now
        """)
    int expireOverdueBookings(
            @Param("pendingStatus") Integer pendingStatus,
            @Param("newStatus") Integer newStatus,
            @Param("now") LocalDateTime now
    );


    @Query("SELECT COUNT(b) FROM BookingEntity b WHERE b.status = :status")
    long countByStatus(@Param("status") Integer status);

    @Query("""
        SELECT COUNT(b) FROM BookingEntity b
        WHERE b.status = :status
          AND b.expirationTime IS NOT NULL
          AND b.expirationTime > :now
          AND b.expirationTime < :threshold
        """)
    long countBookingsExpiringSoon(
            @Param("status") Integer status,
            @Param("now") LocalDateTime now,
            @Param("threshold") LocalDateTime threshold
    );
}
