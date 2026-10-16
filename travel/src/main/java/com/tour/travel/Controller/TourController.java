package com.tour.travel.Controller;

import com.tour.travel.Entity.TourImageEntity;
import com.tour.travel.dto.request.tour.TourAdminRequest;
import com.tour.travel.dto.request.tour.TourFilterRequest;
import com.tour.travel.dto.request.tour.TourImageRequest;
import com.tour.travel.dto.response.tour.*;
import com.tour.travel.Service.ITourService;
import com.tour.travel.Service.impl.FileStorageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tours")
@RequiredArgsConstructor
public class TourController {

    private final ITourService tourService;
    private final FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<TourListResponse> getTours(
            @ModelAttribute TourFilterRequest request,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "10") int limit) {

        PageRequest pageRequest = PageRequest.of(offset, limit, Sort.by("createdAt").descending());
        Page<TourResponse> tourPage = tourService.getAllTours(request, pageRequest);

        return ResponseEntity.ok(TourListResponse.builder()
                .tours(tourPage.getContent())
                .page(offset)
                .limit(limit)
                .totalPages(tourPage.getTotalPages())
                .totalItems(tourPage.getTotalElements())
                .build());
    }

    @GetMapping("/suggest")
    public ResponseEntity<TourListResponse> searchTours(
            @RequestParam("keyword") String keyword,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "10") int limit) {

        PageRequest pageRequest = PageRequest.of(offset, limit, Sort.by("createdAt").descending());
        Page<TourResponse> tourPage = tourService.searchToursByName(keyword, pageRequest);

        return ResponseEntity.ok(TourListResponse.builder()
                .tours(tourPage.getContent())
                .page(offset)
                .limit(limit)
                .totalPages(tourPage.getTotalPages())
                .totalItems(tourPage.getTotalElements())
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourDetailResponse> getTourDetail(@PathVariable Integer id) {
        return ResponseEntity.ok(tourService.getTourDetail(id));
    }

    @GetMapping("/admin/{id}")
    public ResponseEntity<TourAdminResponse> getTourForAdmin(@PathVariable Integer id) {
        return ResponseEntity.ok(tourService.getTourForAdmin(id));
    }

    @GetMapping("/admin")
    public ResponseEntity<TourAdminInitResponse> getTourInitData() {
        return ResponseEntity.ok(tourService.getTourInitData());
    }

    @PostMapping
    public ResponseEntity<?> createTour(@Valid @RequestBody TourAdminRequest request) {
        try {
            TourResponse response = tourService.createTour(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTour(
            @PathVariable Integer id,
            @Valid @RequestBody TourAdminRequest request) {
        try {
            TourResponse response = tourService.updateTour(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTour(@PathVariable Integer id) {
        try {
            tourService.deleteTour(id);
            return ResponseEntity.ok(Map.of("message", "Tour deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping(value = "/uploads/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImages(
            @PathVariable("id") Integer tourId,
            @RequestParam("files") List<MultipartFile> files) {
        try {
            List<MultipartFile> validFiles = validateImageFiles(files);

            tourService.deleteAllTourImages(tourId);

            List<TourImageResponse> savedImages = new ArrayList<>();
            for (MultipartFile file : validFiles) {
                String filename = fileStorageService.storeFile(file);
                TourImageResponse image = tourService.uploadTourImage(tourId,
                        TourImageRequest.builder().imageUrl(filename).build());
                savedImages.add(image);
            }

            if (!savedImages.isEmpty()) {
                tourService.updateTourAvatar(tourId, savedImages.get(0).getImageUrl());
            }

            return ResponseEntity.ok(savedImages);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/images/{imageName}")
    public ResponseEntity<?> viewImage(@PathVariable String imageName) {
        try {
            java.nio.file.Path imagePath = Paths.get("uploads/" + imageName);
            UrlResource resource = new UrlResource(imagePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    private List<MultipartFile> validateImageFiles(List<MultipartFile> files) {
        if (files == null) {
            return new ArrayList<>();
        }

        List<MultipartFile> validFiles = files.stream()
                .filter(file -> file.getSize() > 0)
                .toList();

        if (validFiles.size() > TourImageEntity.MAXIMUM_IMAGES_PER_TOUR) {
            throw new IllegalArgumentException("Maximum " + TourImageEntity.MAXIMUM_IMAGES_PER_TOUR + " images allowed");
        }

        for (MultipartFile file : validFiles) {
            if (file.getSize() > 10 * 1024 * 1024) {
                throw new IllegalArgumentException("File size exceeds 10MB limit");
            }
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new IllegalArgumentException("Only image files are allowed");
            }
        }

        return new ArrayList<>(validFiles);
    }
}
