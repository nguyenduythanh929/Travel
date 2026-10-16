package com.tour.travel.dto.response.dashboard;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class RevenueReportResponse {
    private Double totalRevenue;
    private Long totalBookings;
    private Long paidBookings;
    private Long pendingBookings;
    private Long cancelledBookings;
    private Long expiredBookings;
    private List<DailyRevenue> dailyRevenue;

    @Data
    @Builder
    public static class DailyRevenue {
        private LocalDate date;
        private Double revenue;
        private Long bookingCount;
    }
}
