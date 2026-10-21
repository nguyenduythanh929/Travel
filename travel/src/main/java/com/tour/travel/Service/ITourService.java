package com.tour.travel.Service;

import com.tour.travel.dto.request.tour.TourAdminRequest;
import com.tour.travel.dto.request.tour.TourFilterRequest;
import com.tour.travel.dto.request.tour.TourImageRequest;
import com.tour.travel.dto.response.tour.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface ITourService {

    Page<TourResponse> getAllTours(TourFilterRequest request, PageRequest pageRequest);
    Page<TourResponse> searchToursByName(String keyword, PageRequest pageRequest);
    List<TourResponse> getTopToursByType(Integer parentId, Integer limit);
    TourDetailResponse getTourDetail(int id);

    TourAdminResponse getTourForAdmin(Integer id);
    TourAdminInitResponse getTourInitData();
    TourResponse createTour(TourAdminRequest request);
    TourResponse updateTour(Integer id, TourAdminRequest request);
    void deleteTour(Integer id);

    TourImageResponse uploadTourImage(Integer tourId, TourImageRequest request);
    void deleteAllTourImages(Integer id);
    void updateTourAvatar(Integer tourId, String avatarUrl);
}
