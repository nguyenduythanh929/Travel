package com.tour.travel.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * Shopping Cart Entity - Separate from Booking
 * Used for temporary purchase intent only, no payment or status logic.
 * Cart items are converted to Booking at checkout stage.
 */
@Entity
@Table(name = "carts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartEntity extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private UserEntity user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItemEntity> items = new ArrayList<>();

    @Column(name = "total_items")
    private Integer totalItems = 0;

    @Column(name = "subtotal")
    private Double subtotal = 0.0;

    public void recalculateTotals() {
        this.totalItems = items.size();
        this.subtotal = items.stream()
                .mapToDouble(item -> item.getSubtotal() != null ? item.getSubtotal() : 0.0)
                .sum();
    }

    public void addItem(CartItemEntity item) {
        items.add(item);
        item.setCart(this);
        recalculateTotals();
    }

    public void removeItem(CartItemEntity item) {
        items.remove(item);
        item.setCart(null);
        recalculateTotals();
    }

    public void clearItems() {
        items.clear();
        recalculateTotals();
    }
}
