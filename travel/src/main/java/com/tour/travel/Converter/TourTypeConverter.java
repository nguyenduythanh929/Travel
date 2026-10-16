package com.tour.travel.Converter;

import com.tour.travel.Entity.TourTypeEntity;
import com.tour.travel.dto.request.tourtype.TourTypeRequest;
import com.tour.travel.dto.response.tourtype.TourTypeResponse;
import com.tour.travel.Repository.TourTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TourTypeConverter {

    private final TourTypeRepository tourTypeRepository;

    public TourTypeResponse toResponse(TourTypeEntity entity) {
        TourTypeResponse dto = new TourTypeResponse();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setValue(entity.getValue());
        dto.setDescription(entity.getDescription());
        dto.setStatus(entity.getStatus());
        dto.setParentId(entity.getParentId());
        return dto;
    }

    public TourTypeEntity toEntity(Integer id, TourTypeRequest request) {
        TourTypeEntity entity = new TourTypeEntity();
        if(id != null) {
            entity = tourTypeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy tourType có id = " + id));
        }
        entity.setName(request.getName());
        entity.setDescription(request.getDescription());
        entity.setStatus(request.getStatus());
        entity.setParentId(request.getParentId());
        return entity;
    }
}
