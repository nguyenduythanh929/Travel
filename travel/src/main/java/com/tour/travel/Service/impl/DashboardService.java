package com.tour.travel.Service.impl;

import com.tour.travel.Entity.Enums.PaymentStatus;
import com.tour.travel.dto.dashboard.RevenueByDateDTO;
import com.tour.travel.dto.response.dashboard.DashboardResponse;
import com.tour.travel.Repository.BookingRepository;
import com.tour.travel.Repository.UserRepository;
import com.tour.travel.Service.IDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService implements IDashboardService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    @Override
    public DashboardResponse getDashboardData(LocalDateTime startDate, LocalDateTime endDate) {
        Long totalUsers = userRepository.count();
        Long totalBookings = bookingRepository.count();
        Double totalRevenue = bookingRepository.getTotalRevenue(PaymentStatus.SUCCESS.getValue());
        List<RevenueByDateDTO> revenueByDate = getRevenueByDateList(startDate, endDate);
        return new DashboardResponse(totalUsers, totalBookings, totalRevenue, revenueByDate);
    }

    private List<RevenueByDateDTO> getRevenueByDateList(LocalDateTime startDate, LocalDateTime endDate) {
        List<Object[]> results = bookingRepository.getRevenueByDate(PaymentStatus.SUCCESS.getValue(), startDate, endDate);
        List<RevenueByDateDTO> revenueList = new ArrayList<>();
        for (Object[] result : results) {
            LocalDate date = (LocalDate) result[0];
            Double revenue = ((Number) result[1]).doubleValue();
            revenueList.add(new RevenueByDateDTO(date, revenue));
        }
        return revenueList;
    }
}
