package com.tour.travel.dto.response.tourtype;

import com.tour.travel.dto.response.common.BaseResponse;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourTypeResponse extends BaseResponse {
    private Integer id;
    private String name;
    private String value;
    private String description;
    private Integer status;
    private Integer parentId;
    private List<TourTypeResponse> tourTypes;
    private List<TourTypeResponse> children;
    private boolean selected;
}
