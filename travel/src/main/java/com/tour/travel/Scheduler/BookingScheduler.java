package com.tour.travel.Scheduler;

import com.tour.travel.Service.IBookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduler for automatic booking management tasks.
 * Handles booking expiration and completion based on tour dates.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class BookingScheduler {

    private final IBookingService bookingService;

    /**
     * Expire overdue bookings every 5 minutes.
     * Marks PENDING_PAYMENT bookings as EXPIRED if past their expiration time.
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    public void expireOverdueBookings() {
        try {
            int expiredCount = bookingService.expireOverdueBookings();
            if (expiredCount > 0) {
                log.info("Scheduler: Expired {} overdue bookings", expiredCount);
            }
        } catch (Exception e) {
            log.error("Scheduler: Failed to expire overdue bookings", e);
        }
    }

    /**
     * Mark completed bookings every hour.
     * Marks PAID bookings as COMPLETED if all tours have ended.
     */
    @Scheduled(fixedRate = 3600000) // 1 hour
    public void markCompletedBookings() {
        try {
            int completedCount = bookingService.markCompletedBookings();
            if (completedCount > 0) {
                log.info("Scheduler: Marked {} bookings as completed", completedCount);
            }
        } catch (Exception e) {
            log.error("Scheduler: Failed to mark completed bookings", e);
        }
    }

    /**
     * Run initial checks at startup (after 30 seconds delay).
     */
    @Scheduled(initialDelay = 30000, fixedDelay = Long.MAX_VALUE)
    public void runInitialChecks() {
        log.info("Scheduler: Running initial booking checks...");
        try {
            int expiredCount = bookingService.expireOverdueBookings();
            int completedCount = bookingService.markCompletedBookings();
            log.info("Scheduler: Initial checks completed - expired: {}, completed: {}", expiredCount, completedCount);
        } catch (Exception e) {
            log.error("Scheduler: Failed to run initial checks", e);
        }
    }
}
