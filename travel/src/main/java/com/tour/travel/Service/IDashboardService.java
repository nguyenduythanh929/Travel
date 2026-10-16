package com.tour.travel.Service;

import com.tour.travel.dto.response.dashboard.DashboardResponse;

import java.time.LocalDateTime;

public interface IDashboardService {
    DashboardResponse getDashboardData(LocalDateTime startDate, LocalDateTime endDate);
}
