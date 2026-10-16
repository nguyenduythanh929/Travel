package com.tour.travel.dto.response.tour;

import com.tour.travel.dto.response.common.BaseResponse;
import com.tour.travel.dto.response.location.LocationResponse;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TourDetailResponse extends BaseResponse {
    private Integer id;
    private String name;
    private String avatar;
    private int duration;
    private String transport;
    private LocalDate departureDate;
    private List<String> images;
    private String tourDetail;
    private List<TourScheduleResponse> schedules;
    private List<LocationResponse> locations;
    private Double priceAdult;
    private Double priceChild;
    private Double priceInfant;
    private Double rating;
    private Long totalReviews;
}
