package com.tour.travel.Service.impl;

import com.tour.travel.Converter.TourTypeConverter;
import com.tour.travel.Entity.TourEntity;
import com.tour.travel.Entity.TourTypeEntity;
import com.tour.travel.Exceptions.DataNotFoundException;
import com.tour.travel.dto.request.tourtype.TourTypeFilterRequest;
import com.tour.travel.dto.request.tourtype.TourTypeRequest;
import com.tour.travel.dto.response.tourtype.TourTypeListResponse;
import com.tour.travel.dto.response.tourtype.TourTypeResponse;
import com.tour.travel.Repository.TourRepository;
import com.tour.travel.Repository.TourTypeRepository;
import com.tour.travel.Service.ITourTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TourTypeService implements ITourTypeService {

    private final TourTypeRepository tourTypeRepository;
    private final TourTypeConverter tourTypeConverter;
    private final TourRepository tourRepository;

    @Override
    public TourTypeResponse createTourType(TourTypeRequest request) {
        TourTypeEntity entity = tourTypeConverter.toEntity(null, request);
        TourTypeEntity saved = tourTypeRepository.save(entity);
        return tourTypeConverter.toResponse(saved);
    }

    @Override
    public TourTypeResponse getTourTypeById(Integer id) {
        TourTypeEntity type = tourTypeRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy danh mục với id = " + id));
        TourTypeResponse dto = tourTypeConverter.toResponse(type);
        List<TourTypeResponse> tourTypes = tourTypeRepository.findAll().stream()
                .map(tourTypeConverter::toResponse)
                .toList();
        dto.setTourTypes(tourTypes);
        return dto;
    }

    @Override
    public List<TourTypeResponse> getAllTourTypesForAdmin() {
        return tourTypeRepository.findAll().stream()
                .map(tourTypeConverter::toResponse).toList();
    }

    @Override
    public List<TourTypeResponse> getTourTypesTree() {
        List<TourTypeEntity> allTypes = tourTypeRepository.findAll();
        List<TourTypeResponse> allResponses = allTypes.stream()
                .map(tourTypeConverter::toResponse)
                .toList();
        Map<Integer, List<TourTypeResponse>> childrenByParentId = allResponses.stream()
                .filter(type -> type.getParentId() != null)
                .collect(Collectors.groupingBy(TourTypeResponse::getParentId));
        List<TourTypeResponse> rootTypes = allResponses.stream()
                .filter(type -> type.getParentId() == 0)
                .collect(Collectors.toList());
        rootTypes.forEach(parent -> buildChildren(parent, childrenByParentId));
        return rootTypes;
    }

    private void buildChildren(TourTypeResponse parent, Map<Integer, List<TourTypeResponse>> childrenByParentId) {
        List<TourTypeResponse> children = childrenByParentId.getOrDefault(parent.getId(), new ArrayList<>());
        if (!children.isEmpty()) {
            parent.setChildren(children);
            children.forEach(child -> buildChildren(child, childrenByParentId));
        }
    }

    @Override
    public TourTypeResponse updateTourType(Integer id, TourTypeRequest request) {
        TourTypeEntity entity =tourTypeConverter.toEntity(id, request);
        TourTypeEntity updated = tourTypeRepository.save(entity);
        return tourTypeConverter.toResponse(updated);
    }

    @Override
    public void deleteTourType(Integer id) {
        TourTypeEntity existing = tourTypeRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy danh mục với id = " + id));
        boolean hasChildren = tourTypeRepository.findAll().stream()
                .anyMatch(t -> id.equals(t.getParentId()));
        if (hasChildren) {
            throw new IllegalStateException("Không thể xóa danh mục này vì vẫn còn danh mục con.");
        }
        tourTypeRepository.delete(existing);
    }

    @Override
    public TourTypeListResponse searchTourTypes(TourTypeFilterRequest request, int offset, int limit) {
        PageRequest pageRequest = PageRequest.of(offset, limit, Sort.by("createdAt").descending());
        Page<TourTypeEntity> page = tourTypeRepository.searchTourTypes(
                request.getName(),
                request.getStatus(),
                request.getCreatedBy(),
                request.getStartDate(),
                request.getEndDate(),
                pageRequest
        );
        List<TourTypeResponse> data = page.getContent().stream().map(type -> {
            TourTypeResponse dto = tourTypeConverter.toResponse(type);
            dto.setCreatedBy(type.getCreatedBy());
            dto.setCreatedAt(type.getCreatedAt());
            return dto;
        }).toList();
        TourTypeListResponse response = new TourTypeListResponse();
        response.setData(data);
        response.setTotalItems(page.getTotalElements());
        response.setTotalPages(page.getTotalPages());
        response.setCurrentPage(offset);
        return response;
    }

    @Override
    public TourTypeResponse getTourTypeByTourId(Integer tourId) {
        TourEntity tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy tour với id = " + tourId));

        TourTypeEntity tourType = tour.getTourType();
        if (tourType == null) {
            throw new DataNotFoundException("Tour với id = " + tourId + " không có danh mục tour");
        }

        return tourTypeConverter.toResponse(tourType);
    }

}
