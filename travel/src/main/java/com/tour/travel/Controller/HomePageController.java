package com.tour.travel.Controller;


import com.tour.travel.dto.response.tour.TourHomeListResponse;
import com.tour.travel.dto.response.tour.TourResponse;

import com.tour.travel.Service.impl.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/homepage")
@RequiredArgsConstructor
public class HomePageController {

    private final TourService tourService;

    @GetMapping("/init")
    public ResponseEntity<Map<String, Object>> getHomePageData() {
        List<TourResponse> domesticTours = tourService.getTopToursByType(1, 8);

        List<TourResponse> internationalTours = tourService.getTopToursByType(2, 8);

        long toursOnSale = domesticTours.stream().filter(TourResponse::getIsOnSale).count() +
                internationalTours.stream().filter(TourResponse::getIsOnSale).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalActiveTours", domesticTours.size() + internationalTours.size());
        stats.put("toursOnSale", toursOnSale);

        Map<String, Object> response = new HashMap<>();
        response.put("domesticTours", domesticTours);
        response.put("internationalTours", internationalTours);
        response.put("stats", stats);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/tours")
    public ResponseEntity<TourHomeListResponse> getHomeTours() {
        List<TourResponse> domesticTours = tourService.getTopToursByType(1, 8);

        List<TourResponse> internationalTours = tourService.getTopToursByType(2, 8);

        TourHomeListResponse response = TourHomeListResponse.builder()
                .domesticTours(domesticTours)
                .internationalTours(internationalTours)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/hot-deals")
    public ResponseEntity<List<TourResponse>> getHotDeals() {
        List<TourResponse> allTours = tourService.getTopToursByType(1, 20);

        List<TourResponse> hotDeals = allTours.stream()
                .filter(tour -> tour.getIsOnSale() != null && tour.getIsOnSale())
                .sorted((t1, t2) -> t2.getDiscountPercent().compareTo(t1.getDiscountPercent()))
                .limit(8)
                .toList();

        return ResponseEntity.ok(hotDeals);
    }
}

