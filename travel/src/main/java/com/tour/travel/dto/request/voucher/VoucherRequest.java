package com.tour.travel.dto.request.voucher;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherRequest {
    private String code;
    private String description;
    private String discountType;
    private Double discountValue;
    private Double minPurchaseAmount;
    private Double maxDiscountAmount;
    private LocalDateTime validFrom;
    private LocalDateTime validTo;
    private Integer usageLimit;
    private Boolean isActive;
}
