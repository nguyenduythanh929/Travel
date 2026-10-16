package com.tour.travel.Controller;

import com.tour.travel.dto.request.tourtype.TourTypeFilterRequest;
import com.tour.travel.dto.request.tourtype.TourTypeRequest;
import com.tour.travel.dto.response.tourtype.TourTypeListResponse;
import com.tour.travel.dto.response.tourtype.TourTypeResponse;
import com.tour.travel.Service.ITourTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tour_types")
@RequiredArgsConstructor
public class TourTypeController {

    private final ITourTypeService tourTypeService;

    @PostMapping
    public ResponseEntity<?> createTourType(@RequestBody TourTypeRequest request) {
        try {
            TourTypeResponse response = tourTypeService.createTourType(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTourType(
            @PathVariable("id") Integer id,
            @RequestBody TourTypeRequest request
    ) {
        try {
            TourTypeResponse response = tourTypeService.updateTourType(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchTourTypes(@ModelAttribute TourTypeFilterRequest request,
                                             @RequestParam("offset") int offset,
                                             @RequestParam("limit") int limit) {
        try {
            TourTypeListResponse response = tourTypeService.searchTourTypes(request, offset, limit);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping
    public ResponseEntity<?> getTourTypesForAdmin() {
        try {
            List<TourTypeResponse> tourTypes = tourTypeService.getAllTourTypesForAdmin();
            return ResponseEntity.ok(tourTypes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTourTypeById(@PathVariable("id") Integer id) {
        try {
            TourTypeResponse response = tourTypeService.getTourTypeById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/tree")
    public ResponseEntity<?> getTourTypesTree() {
        try {
            List<TourTypeResponse> tourTypesTree = tourTypeService.getTourTypesTree();
            return ResponseEntity.ok(tourTypesTree);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTourType(@PathVariable("id") Integer id) {
        try {
            tourTypeService.deleteTourType(id);
            return ResponseEntity.ok("Đã xóa vĩnh viễn danh mục với id = " + id);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/tour/{tourId}")
    public ResponseEntity<?> getTourTypeByTourId(@PathVariable("tourId") Integer tourId) {
        try {
            TourTypeResponse response = tourTypeService.getTourTypeByTourId(tourId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
