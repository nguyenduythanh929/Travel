package com.tour.travel.dto.request.promotion;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class PromotionRequest {

    @NotBlank(message = "Tên promotion không được để trống")
    @Size(max = 255, message = "Tên không được quá 255 ký tự")
    private String name;

    @NotNull(message = "Discount không được để trống")
    @Min(value = 0, message = "Discount phải >= 0")
    @Max(value = 100, message = "Discount phải <= 100 (nếu là %)")
    private Integer discount;

    private String discountType;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @Size(max = 1000, message = "Mô tả không được quá 1000 ký tự")
    private String description;

    @NotNull(message = "Status không được để trống")
    private Integer status;

    private List<Integer> tourIds;
}
