package com.tour.travel.dto.request.tourtype;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TourTypeRequest {
    private String name;
    private String description;
    private Integer status;
    private Integer parentId;
}
