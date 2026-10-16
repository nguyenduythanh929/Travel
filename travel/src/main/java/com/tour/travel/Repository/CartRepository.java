package com.tour.travel.Repository;

import com.tour.travel.Entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CartRepository extends JpaRepository<CartEntity, Integer> {

    Optional<CartEntity> findByUserId(Integer userId);

    @Query("SELECT c FROM CartEntity c LEFT JOIN FETCH c.items WHERE c.user.id = :userId")
    Optional<CartEntity> findByUserIdWithItems(@Param("userId") Integer userId);

    boolean existsByUserId(Integer userId);

    void deleteByUserId(Integer userId);
}
