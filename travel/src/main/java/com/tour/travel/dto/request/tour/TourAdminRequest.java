package com.tour.travel.dto.request.tour;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourAdminRequest {

    @NotBlank(message = "Tour name is required")
    private String name;

    private String avatar;

    @NotNull(message = "Adult price is required")
    @Positive(message = "Adult price must be positive")
    private Double priceAdult;

    @Min(value = 0, message = "Child price must be >= 0")
    private Double priceChild;

    @Min(value = 0, message = "Infant price must be >= 0")
    private Double priceInfant;

    private String description;
    private String tourDetail;
    private String note;

    @Min(value = 0, message = "Remaining adult slots must be >= 0")
    private Integer remainAdult;

    @Min(value = 0, message = "Remaining child slots must be >= 0")
    private Integer remainChild;

    @Min(value = 0, message = "Remaining infant slots must be >= 0")
    private Integer remainInfant;

    @NotNull(message = "Duration is required")
    @Positive(message = "Duration must be positive")
    private Integer duration;

    private String transport;
    private Integer status;

    @NotNull(message = "Tour type is required")
    private Integer tourTypeId;

    private List<Integer> locationIds;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate departureDates;

    @Valid
    private List<TourScheduleRequest> schedules;

    @Min(value = 0, message = "Discount must be >= 0")
    private Integer discount;

    private String discountType;
}
