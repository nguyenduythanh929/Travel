package com.tour.travel.dto.response.dashboard;

import com.tour.travel.dto.dashboard.RevenueByDateDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private Long totalUsers;
    private Long totalBookings;
    private Double totalRevenue;
    private List<RevenueByDateDTO> revenueByDate;
}
