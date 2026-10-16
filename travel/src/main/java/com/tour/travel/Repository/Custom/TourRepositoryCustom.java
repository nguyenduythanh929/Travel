package com.tour.travel.Repository.Custom;

import com.tour.travel.Entity.TourEntity;
import com.tour.travel.dto.request.tour.TourFilterRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TourRepositoryCustom {
    Page<TourEntity> searchTours(TourFilterRequest filter, Pageable pageable);
}
