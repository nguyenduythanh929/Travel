package com.tour.travel.Service;

import com.tour.travel.dto.request.tourtype.TourTypeFilterRequest;
import com.tour.travel.dto.request.tourtype.TourTypeRequest;
import com.tour.travel.dto.response.tourtype.TourTypeListResponse;
import com.tour.travel.dto.response.tourtype.TourTypeResponse;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface ITourTypeService {
    TourTypeResponse createTourType(TourTypeRequest request);
    List<TourTypeResponse> getTourTypesTree();
    TourTypeResponse getTourTypeById(Integer id);
    List<TourTypeResponse> getAllTourTypesForAdmin();
    TourTypeResponse updateTourType(Integer id, TourTypeRequest request);
    void deleteTourType(Integer id);
    TourTypeListResponse searchTourTypes(TourTypeFilterRequest request, int offset, int limit);
    TourTypeResponse getTourTypeByTourId(Integer tourId);
}
