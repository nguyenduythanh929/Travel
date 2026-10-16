package com.tour.travel.Repository;

import com.tour.travel.Entity.ContactEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface ContactRepository extends JpaRepository<ContactEntity, Integer> {

    @Query("""
        SELECT c FROM ContactEntity c
        WHERE c.status = 1
          AND :keyword IS NULL OR :keyword = '' OR\s
               LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
          AND (:startDate IS NULL OR c.createdAt >= :startDate)
          AND (:endDate IS NULL OR c.createdAt <= :endDate)
        ORDER BY c.createdAt DESC
       \s""")
    Page<ContactEntity> searchContacts(
            @Param("keyword") String keyword,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );
}
