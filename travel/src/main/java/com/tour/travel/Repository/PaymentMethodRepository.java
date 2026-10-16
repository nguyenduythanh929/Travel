package com.tour.travel.Repository;

import com.tour.travel.Entity.PaymentMethodEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethodEntity, Integer> {
}
