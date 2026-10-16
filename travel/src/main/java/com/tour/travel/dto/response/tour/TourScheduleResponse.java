package com.tour.travel.dto.response.tour;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourScheduleResponse {
    private Integer id;
    private String title;
    private String description;
}

