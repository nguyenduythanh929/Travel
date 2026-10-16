package com.tour.travel.Repository;

import com.tour.travel.Entity.VNPayTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VNPayTransactionRepository extends JpaRepository<VNPayTransactionEntity, Integer> {
    Optional<VNPayTransactionEntity> findByVnpTxnRef(String vnpTxnRef);
    Optional<VNPayTransactionEntity> findByVnpTransactionNo(String vnpTransactionNo);
}
