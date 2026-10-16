package com.tour.travel.Repository;

import com.tour.travel.Entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    UserEntity findOneByEmailAndStatus(String email, int status);
    Optional<UserEntity> findByEmail(String email);

    @Query("SELECT u FROM UserEntity u LEFT JOIN u.roles r WHERE " +
            "(:keyword IS NULL OR :keyword = '' OR " +
            "LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "u.phone LIKE CONCAT('%', :keyword, '%')) AND " +
            "(:status IS NULL OR u.status = :status) AND " +
            "(:fromDate IS NULL OR u.createdAt >= :fromDate) AND " +
            "(:toDate IS NULL OR u.createdAt <= :toDate) AND " +
            "(:isAdmin IS NULL OR " +
            "(:isAdmin = true AND EXISTS (SELECT r2 FROM u.roles r2 WHERE r2.code = 'ADMIN')) OR " +
            "(:isAdmin = false AND NOT EXISTS (SELECT r3 FROM u.roles r3 WHERE r3.code = 'ADMIN')))")
    Page<UserEntity> searchUsersWithFilters(
            @Param("keyword") String keyword,
            @Param("status") Integer status,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            @Param("isAdmin") Boolean isAdmin,
            Pageable pageable
    );

    @Query("SELECT DISTINCT u FROM UserEntity u " +
            "LEFT JOIN FETCH u.roles r " +
            "LEFT JOIN FETCH r.permissions " +
            "WHERE u.email = :email AND u.status = :status")
    UserEntity findByEmailWithRolesAndPermissions(@Param("email") String email, @Param("status") int status);

    @Query("SELECT DISTINCT u FROM UserEntity u JOIN u.roles r WHERE r.code = :roleCode AND (:status IS NULL OR u.status = :status)" +
            "AND (:keyword IS NULL OR :keyword = '' OR " +
            "LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "ORDER BY u.createdAt DESC")
    Page<UserEntity> findByRoleCode(
            @Param("roleCode") String roleCode,
            @Param("keyword") String keyword,
            @Param("status") Integer status,
            Pageable pageable
    );
}
