package com.tour.travel.dto.request.tour;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourScheduleRequest {

    @NotBlank(message = "Schedule title is required")
    private String title;

    private String description;
}
