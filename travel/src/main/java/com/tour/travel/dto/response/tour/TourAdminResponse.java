package com.tour.travel.dto.response.tour;

import com.tour.travel.dto.response.common.BaseResponse;
import com.tour.travel.dto.response.location.LocationResponse;
import com.tour.travel.dto.response.tourtype.TourTypeResponse;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourAdminResponse extends BaseResponse {
    private Integer id;
    private String name;
    private List<TourTypeResponse> tourTypes;
    private String avatar;
    private List<String> images;
    private Double priceAdult;
    private Double priceChild;
    private Double priceInfant;
    private Integer remainAdult;
    private Integer remainChild;
    private Integer remainInfant;
    private List<LocationResponse> locations;
    private Integer status;
    private Integer duration;
    private String transport;
    private LocalDate departureDate;
    private String tourDetail;
    private List<TourScheduleResponse> schedules;
    private Integer discount;
    private String discountType;
    private Integer promotionId;
    private String createdBy;
    private String updatedBy;
}
