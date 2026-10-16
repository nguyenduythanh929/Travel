package com.tour.travel.Repository;

import com.tour.travel.Entity.CartItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItemEntity, Integer> {

    List<CartItemEntity> findByCartId(Integer cartId);

    List<CartItemEntity> findByCartUserId(Integer userId);

    Optional<CartItemEntity> findByCartIdAndTourId(Integer cartId, Integer tourId);

    Optional<CartItemEntity> findByCartUserIdAndTourId(Integer userId, Integer tourId);

    @Query("SELECT ci FROM CartItemEntity ci WHERE ci.id IN :ids AND ci.cart.user.id = :userId")
    List<CartItemEntity> findByIdInAndCartUserId(@Param("ids") List<Integer> ids, @Param("userId") Integer userId);

    @Modifying
    @Query("DELETE FROM CartItemEntity ci WHERE ci.cart.id = :cartId")
    void deleteAllByCartId(@Param("cartId") Integer cartId);

    @Modifying
    @Query("DELETE FROM CartItemEntity ci WHERE ci.cart.user.id = :userId")
    void deleteAllByCartUserId(@Param("userId") Integer userId);

    int countByCartId(Integer cartId);

    @Query("SELECT COALESCE(SUM(ci.subtotal), 0.0) FROM CartItemEntity ci WHERE ci.cart.id = :cartId")
    Double calculateCartSubtotal(@Param("cartId") Integer cartId);
}
