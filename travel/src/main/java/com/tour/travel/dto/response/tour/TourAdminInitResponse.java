package com.tour.travel.dto.response.tour;

import com.tour.travel.dto.response.location.LocationResponse;
import com.tour.travel.dto.response.tourtype.TourTypeResponse;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourAdminInitResponse {
    private List<LocationResponse> locations;
    private List<TourTypeResponse> tourTypes;
}
