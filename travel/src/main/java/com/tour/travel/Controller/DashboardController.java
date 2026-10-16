package com.tour.travel.Controller;

import com.tour.travel.dto.response.dashboard.DashboardResponse;
import com.tour.travel.Service.IDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final IDashboardService dashboardService;

    /**
     * Lấy dữ liệu tổng quan cho dashboard
     *
     * @param startDate Ngày bắt đầu (optional) - format: yyyy-MM-dd'T'HH:mm:ss
     * @param endDate Ngày kết thúc (optional) - format: yyyy-MM-dd'T'HH:mm:ss
     * @return DashboardResponse chứa: totalUsers, totalBookings, totalRevenue, revenueByDate
     *
     * Ví dụ:
     * GET /api/dashboard
     * GET /api/dashboard?startDate=2025-09-01T00:00:00&endDate=2025-10-31T23:59:59
     */
    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboardData(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime startDate,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime endDate
    ) {
        DashboardResponse response = dashboardService.getDashboardData(startDate, endDate);
        return ResponseEntity.ok(response);
    }
}
