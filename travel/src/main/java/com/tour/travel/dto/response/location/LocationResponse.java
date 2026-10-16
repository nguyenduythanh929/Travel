package com.tour.travel.dto.response.location;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationResponse {
    private Integer id;
    private String name;
    private boolean selected;
}
