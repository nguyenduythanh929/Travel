package com.tour.travel.Converter;

import com.tour.travel.Entity.*;
import com.tour.travel.dto.tour.TourReviewSummary;
import com.tour.travel.dto.request.tour.TourAdminRequest;
import com.tour.travel.dto.request.tour.TourScheduleRequest;
import com.tour.travel.dto.response.location.LocationResponse;
import com.tour.travel.dto.response.tour.TourAdminInitResponse;
import com.tour.travel.dto.response.tour.TourAdminResponse;
import com.tour.travel.dto.response.tour.TourDetailResponse;
import com.tour.travel.dto.response.tour.TourResponse;
import com.tour.travel.dto.response.tour.TourScheduleResponse;
import com.tour.travel.dto.response.tourtype.TourTypeResponse;
import com.tour.travel.Repository.*;
import com.tour.travel.Service.IReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class TourConverter {

    private final TourRepository tourRepository;
    private final TourTypeRepository tourTypeRepository;
    private final LocationRepository locationRepository;
    private final DepartureDateRepository departureDateRepository;
    private final TourTypeConverter tourTypeConverter;
    private final PromotionRepository promotionRepository;
    private final IReviewService reviewService;

    public TourResponse toResponse(TourEntity entity) {
        if (entity == null) {
            return null;
        }
        Double originalPrice = entity.getPriceAdult();
        PromotionEntity promotion = promotionRepository
                .findBestPromotionForTour(entity.getId(), LocalDateTime.now())
                .orElse(null);
        Double discountedPrice = originalPrice;
        Integer discountPercent = 0;
        boolean isOnSale = false;
        String promotionName = null;
        if (promotion != null && promotion.isActive()) {
            discountPercent = promotion.getDiscount();
            discountedPrice = promotion.calculateDiscountedPrice(originalPrice);
            isOnSale = true;
            promotionName = promotion.getName();
        }
        TourReviewSummary tourReviewSummary = reviewService.getTourReviewSummary(entity.getId());
        return TourResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .imageUrl(entity.getAvatar())
                .originalPrice(entity.getPriceAdult())
                .discountedPrice(discountedPrice)
                .discountPercent(discountPercent)
                .isOnSale(isOnSale)
                .promotionName(promotionName)
                .startDate(
                        entity.getDepartureDates() != null && !entity.getDepartureDates().isEmpty()
                                ? entity.getDepartureDates().get(0).getDate()
                                : null
                )
                .duration(entity.getDuration() != null ? entity.getDuration().toString() : null)
                .remainSlot((entity.getRemainAdult() != null ? entity.getRemainAdult() : 0) +
                        (entity.getRemainChild() != null ? entity.getRemainChild() : 0) +
                        (entity.getRemainInfant() != null ? entity.getRemainInfant() : 0))
                .rating(tourReviewSummary.getAverageRating())
                .reviewCount(tourReviewSummary.getTotalReviews())
                .status(entity.getStatus())
                .priceAdult(entity.getPriceAdult())
                .priceChild(entity.getPriceChild())
                .priceInfant(entity.getPriceInfant())
                .remainAdult(entity.getRemainAdult())
                .remainChild(entity.getRemainChild())
                .remainInfant(entity.getRemainInfant())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .build();
    }

    public TourDetailResponse toDetailResponse(TourEntity entity) {
        PromotionEntity promotion = promotionRepository
                .findBestPromotionForTour(entity.getId(), LocalDateTime.now())
                .orElse(null);
        Double originalPriceAdult = entity.getPriceAdult();
        Double discountedPriceAdult = originalPriceAdult;
        Double originalPriceChild = entity.getPriceChild();
        Double discountedPriceChild = originalPriceChild;
        Double originalPriceInfant = entity.getPriceInfant();
        Double discountedPriceInfant = originalPriceInfant;
        if (promotion != null && promotion.isActive()) {
            discountedPriceAdult = promotion.calculateDiscountedPrice(originalPriceAdult);
            discountedPriceChild = promotion.calculateDiscountedPrice(originalPriceChild);
            discountedPriceInfant = promotion.calculateDiscountedPrice(originalPriceInfant);
        }
        TourReviewSummary tourReviewSummary = reviewService.getTourReviewSummary(entity.getId());
        return TourDetailResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .avatar(entity.getAvatar())
                .duration(entity.getDuration())
                .departureDate(
                        entity.getDepartureDates() != null && !entity.getDepartureDates().isEmpty()
                                ? entity.getDepartureDates().get(0).getDate()
                                : null
                )
                .images(entity.getImages() != null ?
                        entity.getImages().stream().map(TourImageEntity::getUrl).toList() :
                        new ArrayList<>())
                .tourDetail(entity.getTourDetail())
                .priceAdult(discountedPriceAdult)
                .priceChild(discountedPriceChild)
                .priceInfant(discountedPriceInfant)
                .transport(entity.getTransport())
                .schedules(entity.getTourSchedules() != null ?
                        entity.getTourSchedules().stream().map(this::toScheduleResponse).toList() :
                        new ArrayList<>())
                .locations(entity.getLocations() != null ?
                        entity.getLocations().stream().map(this::toLocationResponse).toList() :
                        new ArrayList<>())
                .rating(tourReviewSummary.getAverageRating())
                .totalReviews(tourReviewSummary.getTotalReviews())
                .build();
    }

    public TourScheduleResponse toScheduleResponse(TourScheduleEntity entity) {
        return TourScheduleResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .build();
    }

    public LocationResponse toLocationResponse(LocationEntity entity) {
        return LocationResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .build();
    }

    public TourEntity toEntity(Integer id, TourAdminRequest request) {
        TourEntity tour;

        // CREATE / UPDATE
        if (id == null) {
            tour = new TourEntity();
            tour.setStatus(1); // default nếu cần
        } else {
            tour = tourRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy tour có id = " + id));
        }

        // ===== BASIC FIELDS =====
        if (request.getName() != null)
            tour.setName(request.getName());

        if (request.getAvatar() != null)
            tour.setAvatar(request.getAvatar());

        if (request.getPriceAdult() != null)
            tour.setPriceAdult(request.getPriceAdult());

        if (request.getPriceChild() != null)
            tour.setPriceChild(request.getPriceChild());

        if (request.getPriceInfant() != null)
            tour.setPriceInfant(request.getPriceInfant());

        if (request.getTransport() != null)
            tour.setTransport(request.getTransport());

        if (request.getTourDetail() != null)
            tour.setTourDetail(request.getTourDetail());

        if (request.getDuration() != null)
            tour.setDuration(request.getDuration());

        if (request.getRemainAdult() != null)
            tour.setRemainAdult(request.getRemainAdult());

        if (request.getRemainChild() != null)
            tour.setRemainChild(request.getRemainChild());

        if (request.getRemainInfant() != null)
            tour.setRemainInfant(request.getRemainInfant());

        if (request.getStatus() != null)
            tour.setStatus(request.getStatus());

        // ===== TOUR TYPE =====
        if (request.getTourTypeId() != null) {
            TourTypeEntity type = tourTypeRepository.findById(request.getTourTypeId())
                    .orElseThrow(() -> new RuntimeException("Tour type not found"));
            tour.setTourType(type);
        }

        // ===== LOCATIONS =====
        if (request.getLocationIds() != null) {
            if (request.getLocationIds().isEmpty()) {
                tour.getLocations().clear(); // cho phép xóa hết khi update
            } else {
                List<LocationEntity> locations =
                        locationRepository.findAllById(request.getLocationIds());
                tour.setLocations(locations);
            }
        }

        // ===== DEPARTURE DATES =====
        if (request.getDepartureDates() != null) {
            List<DepartureDateEntity> allDates = new ArrayList<>();

            List<DepartureDateEntity> existing =
                    departureDateRepository.findAllByDate(request.getDepartureDates());

            if (!existing.isEmpty()) {
                allDates.addAll(existing);
            } else {
                DepartureDateEntity newDep = new DepartureDateEntity();
                newDep.setDate(request.getDepartureDates());
                newDep.setStatus(1);
                departureDateRepository.save(newDep);
                allDates.add(newDep);
            }

            tour.setDepartureDates(allDates); // replace cho cả create & update
        }

        // ===== SCHEDULES =====
        if (request.getSchedules() != null && !request.getSchedules().isEmpty()) {

            if (id != null) {
                tour.getTourSchedules().clear(); // UPDATE mới clear
            }

            for (TourScheduleRequest dto : request.getSchedules()) {
                TourScheduleEntity schedule = new TourScheduleEntity();
                schedule.setTitle(dto.getTitle());
                schedule.setDescription(dto.getDescription());
                schedule.setTour(tour);
                tour.getTourSchedules().add(schedule);
            }
        }

        // ===== PROMOTION =====
        handleTourPromotion(tour, request);

        return tour;
    }


    public TourAdminResponse toTourAdminResponse(TourEntity tour) {
        TourAdminResponse res = new TourAdminResponse();
        res.setId(tour.getId());
        res.setName(tour.getName());
        res.setAvatar(tour.getAvatar());
        res.setPriceAdult(tour.getPriceAdult());
        res.setPriceChild(tour.getPriceChild());
        res.setPriceInfant(tour.getPriceInfant());
        res.setTransport(tour.getTransport());
        res.setDuration(tour.getDuration());
        res.setStatus(tour.getStatus());
        res.setTourDetail(tour.getTourDetail());
        res.setRemainAdult(tour.getRemainAdult());
        res.setRemainChild(tour.getRemainChild());
        res.setRemainInfant(tour.getRemainInfant());
        res.setImages(tour.getImages().stream().map(TourImageEntity::getUrl).toList());

        List<Integer> selectedLocationIds = tour.getLocations().stream()
                .map(LocationEntity::getId)
                .toList();

        List<LocationResponse> locations = locationRepository.findAll().stream()
                .map(loc -> {
                    LocationResponse dto = this.toLocationResponse(loc);
                    dto.setSelected(selectedLocationIds.contains(loc.getId()));
                    return dto;
                })
                .toList();
        Integer selectedTypeId = tour.getTourType().getId();
        List<TourTypeResponse> tourTypes = tourTypeRepository.findAll().stream()
                .map(type -> {
                    TourTypeResponse dto = tourTypeConverter.toResponse(type);
                    dto.setSelected(Objects.equals(selectedTypeId, type.getId()));
                    return dto;
                })
                .toList();
        res.setLocations(locations);
        res.setTourTypes(tourTypes);

        if (tour.getDepartureDates() != null) {
            List<LocalDate> depDates = tour.getDepartureDates().stream()
                    .map(DepartureDateEntity::getDate)
                    .toList();
            res.setDepartureDate(depDates.get(0));
        }

        if (tour.getTourSchedules() != null) {
            List<TourScheduleResponse> schedules = tour.getTourSchedules().stream().map(s -> {
                TourScheduleResponse dto = new TourScheduleResponse();
                dto.setId(s.getId());
                dto.setTitle(s.getTitle());
                dto.setDescription(s.getDescription());
                return dto;
            }).toList();
            res.setSchedules(schedules);
        }

        Optional<PromotionEntity> promotionOpt = promotionRepository
                .findBestPromotionForTour(tour.getId(), LocalDateTime.now());
        if (promotionOpt.isPresent()) {
            PromotionEntity promotion = promotionOpt.get();
            res.setDiscount(promotion.getDiscount());
            res.setDiscountType(promotion.getDiscountType());
            res.setPromotionId(promotion.getId());
        } else {
            res.setDiscount(0);
            res.setDiscountType("PERCENTAGE");
            res.setPromotionId(null);
        }
        return res;
    }

    public TourAdminInitResponse toTourAdminInitResponse() {
        TourAdminInitResponse res = new TourAdminInitResponse();
        List<LocationResponse> locations = locationRepository.findAll().stream()
                .map(loc -> new LocationResponse(loc.getId(), loc.getName(), false))
                .toList();
        List<TourTypeResponse> tourTypes = tourTypeRepository.findAll().stream()
                .map(tourTypeConverter::toResponse)
                .toList();
        res.setLocations(locations);
        res.setTourTypes(tourTypes);
        return res;
    }

    private void handleTourPromotion(TourEntity tour, TourAdminRequest request) {
        if (request.getDiscount() != null && request.getDiscount() > 0) {
            PromotionEntity existingPromotion = null;
            if (tour.getId() != null) {
                Optional<PromotionEntity> promotionOpt = promotionRepository
                        .findBestPromotionForTour(tour.getId(), LocalDateTime.now());
                if (promotionOpt.isPresent()) {
                    existingPromotion = promotionOpt.get();
                }
            }
            String discountType = request.getDiscountType();
            if (discountType == null || discountType.isEmpty()) {
                discountType = "PERCENTAGE"; // Default là phần trăm
            }
            if (existingPromotion != null) {
                existingPromotion.setDiscount(request.getDiscount());
                existingPromotion.setDiscountType(discountType);
                existingPromotion.setName("Giảm giá " + request.getDiscount() +
                        ("PERCENTAGE".equals(discountType) ? "%" : " VND") + " - " + tour.getName());
                promotionRepository.save(existingPromotion);
            } else {
                PromotionEntity newPromotion = new PromotionEntity();
                newPromotion.setName("Giảm giá " + request.getDiscount() +
                        ("PERCENTAGE".equals(discountType) ? "%" : " VND") + " - " + tour.getName());
                newPromotion.setDiscount(request.getDiscount());
                newPromotion.setDiscountType(discountType);
                newPromotion.setStatus(1); // Active
                newPromotion.setStartDate(LocalDateTime.now());
                newPromotion.setEndDate(null); // Không có thời hạn
                PromotionEntity savedPromotion = promotionRepository.save(newPromotion);
                List<TourEntity> tours = new ArrayList<>();
                tours.add(tour);
                savedPromotion.setTours(tours);
                promotionRepository.save(savedPromotion);
                if (tour.getPromotions() == null) {
                    tour.setPromotions(new ArrayList<>());
                }
                tour.getPromotions().add(savedPromotion);
            }
        } else if (request.getDiscount() != null && request.getDiscount() == 0) {
            if (tour.getId() != null) {
                Optional<PromotionEntity> promotionOpt = promotionRepository
                        .findBestPromotionForTour(tour.getId(), LocalDateTime.now());
                if (promotionOpt.isPresent()) {
                    PromotionEntity promotion = promotionOpt.get();
                    promotion.setStatus(0);
                    promotionRepository.save(promotion);
                }
            }
        }
    }
}

