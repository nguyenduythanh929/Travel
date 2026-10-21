package com.tour.travel.Service.impl;

import com.tour.travel.Converter.BookingConverter;
import com.tour.travel.Entity.BookingEntity;
import com.tour.travel.Entity.BookingItemEntity;
import com.tour.travel.Entity.Enums.BookingStatus;
import com.tour.travel.Entity.Enums.PaymentStatus;
import com.tour.travel.Entity.PaymentMethodEntity;
import com.tour.travel.Entity.TourEntity;
import com.tour.travel.Entity.VoucherEntity;
import com.tour.travel.Exceptions.DataNotFoundException;
import com.tour.travel.dto.request.booking.BookingFilterRequest;
import com.tour.travel.dto.request.booking.BookingRequest;
import com.tour.travel.dto.request.booking.CancelBookingRequest;
import com.tour.travel.dto.request.payment.ConfirmCashPaymentRequest;
import com.tour.travel.dto.response.booking.BookingListResponse;
import com.tour.travel.dto.response.booking.BookingResponse;
import com.tour.travel.Repository.BookingRepository;
import com.tour.travel.Repository.PaymentMethodRepository;
import com.tour.travel.Repository.TourRepository;
import com.tour.travel.Service.IBookingService;
import com.tour.travel.Service.INotificationService;
import com.tour.travel.Service.IVoucherService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Service implementation for booking management.
 * Handles all booking operations including payment processing, status transitions,
 * expiration handling, and capacity management.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService implements IBookingService {

    private final BookingRepository bookingRepository;
    private final BookingConverter bookingConverter;
    private final PaymentMethodRepository paymentMethodRepository;
    private final TourRepository tourRepository;
    private final IVoucherService voucherService;
    private final INotificationService notificationService;

    @Override
    public BookingResponse updateBooking(Integer bookingId, BookingRequest request) {
        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new DataNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING_PAYMENT.getValue()) {
            throw new RuntimeException("Cannot update booking. Only pending payment bookings can be updated.");
        }

        if (request.getCustomerName() != null) {
            booking.setCustomerName(request.getCustomerName());
        }
        if (request.getCustomerPhone() != null) {
            booking.setCustomerPhone(request.getCustomerPhone());
        }
        if (request.getNote() != null) {
            booking.setNote(request.getNote());
        }
        if (request.getPaymentMethodId() != null) {
            PaymentMethodEntity method = paymentMethodRepository.findById(request.getPaymentMethodId())
                    .orElseThrow(() -> new DataNotFoundException("Payment method not found"));
            booking.setPaymentMethod(method);
        }

        double totalPrice = booking.getItems().stream()
                .mapToDouble(item -> item.getSubtotal() != null ? item.getSubtotal() : 0.0)
                .sum();
        booking.setTotalPrice(totalPrice);

        if (request.getVoucherCode() != null && !request.getVoucherCode().isEmpty()) {
            if (booking.getVoucherCode() == null || !booking.getVoucherCode().equals(request.getVoucherCode())) {
                VoucherEntity oldVoucher = booking.getVoucher();
                if (oldVoucher != null) {
                    voucherService.decrementUsageCount(oldVoucher);
                }

                VoucherEntity voucher = voucherService.validateAndGetVoucher(request.getVoucherCode(), totalPrice);
                Double discount = voucherService.calculateDiscount(voucher, totalPrice);

                booking.setVoucher(voucher);
                booking.setVoucherCode(request.getVoucherCode());
                booking.setDiscount(discount);

                voucherService.incrementUsageCount(voucher);
            }
        } else if (request.getVoucherCode() != null && booking.getVoucher() != null) {
            voucherService.decrementUsageCount(booking.getVoucher());
            booking.setVoucher(null);
            booking.setVoucherCode(null);
            booking.setDiscount(0.0);
        }

        booking.setFinalPrice(totalPrice - (booking.getDiscount() != null ? booking.getDiscount() : 0.0));

        return bookingConverter.toResponse(bookingRepository.save(booking));
    }

    @Override
    public BookingListResponse searchBookings(BookingFilterRequest request, int offset, int limit) {
        PageRequest pageRequest = PageRequest.of(offset, limit, Sort.by("createdAt").descending());
        Page<BookingEntity> page = bookingRepository.searchBookings(
                request.getKeyword(),
                request.getStatus(),
                request.getPaymentStatus(),
                request.getPaymentMethodId(),
                request.getStartDate(),
                request.getEndDate(),
                pageRequest
        );

        List<BookingResponse> data = page.getContent().stream()
                .map(this::toEnhancedResponse)
                .toList();

        return BookingListResponse.builder()
                .data(data)
                .totalItems(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .currentPage(offset)
                .build();
    }

    public BookingResponse getBooking(int id) {
        BookingEntity booking = bookingRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Booking not found with id: " + id));
        return toEnhancedResponse(booking);
    }

    @Override
    public BookingResponse getBookingByUserId(Integer userId) {
        BookingEntity entity = bookingRepository.findByUser_IdAndStatus(userId, BookingStatus.PENDING_PAYMENT.getValue())
                .orElseThrow(() -> new DataNotFoundException("No pending booking found for user"));
        return toEnhancedResponse(entity);
    }

    @Override
    public List<BookingResponse> getBookingsByUserId(Integer userId) {
        List<BookingEntity> entities = bookingRepository.findAllByUser_Id(userId);

        return entities.stream()
                .map(this::toEnhancedResponse)
                .toList();
    }

    @Override
    public BookingListResponse getAllBookings(int offset, int limit) {
        PageRequest pageRequest = PageRequest.of(offset, limit, Sort.by("createdAt").descending());
        Page<BookingEntity> page = bookingRepository.findAll(pageRequest);

        List<BookingResponse> data = page.getContent().stream()
                .map(this::toEnhancedResponse)
                .toList();

        return BookingListResponse.builder()
                .data(data)
                .totalItems(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .currentPage(offset)
                .build();
    }

    public void deleteBooking(Integer bookingId) {
        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new DataNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING_PAYMENT.getValue()
                && booking.getStatus() != BookingStatus.CANCELLED.getValue()
                && booking.getStatus() != BookingStatus.EXPIRED.getValue()) {
            throw new RuntimeException("Cannot delete booking. Only pending, cancelled or expired bookings can be deleted.");
        }

        bookingRepository.delete(booking);
    }

    @Override
    public BookingResponse getBookingByCode(String bookingCode) {
        BookingEntity booking = bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new DataNotFoundException("Booking not found with code: " + bookingCode));
        return toEnhancedResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse confirmCashPayment(ConfirmCashPaymentRequest request, String staffUsername) {
        BookingEntity booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new DataNotFoundException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING_PAYMENT.getValue()) {
            throw new RuntimeException("Booking is not in PENDING_PAYMENT status. Current status: " +
                    BookingStatus.fromValue(booking.getStatus()).getDescription());
        }

        if (booking.isExpired()) {
            throw new RuntimeException("Booking has expired and cannot accept payment");
        }

        booking.setStatus(BookingStatus.PAID.getValue());
        booking.setPaymentStatus(PaymentStatus.SUCCESS.getValue());
        booking.setPaidAt(LocalDateTime.now());
        booking.setConfirmedByStaff(staffUsername);

        if (request.getStaffNote() != null) {
            String existingNote = booking.getNote() != null ? booking.getNote() + "\n" : "";
            booking.setNote(existingNote + "[Staff Note] " + request.getStaffNote());
        }

        deductTourCapacity(booking);
        booking.setCapacityDeducted(true);

        BookingEntity saved = bookingRepository.save(booking);
        log.info("Cash payment confirmed for booking {} by staff {}", booking.getBookingCode(), staffUsername);

        notificationService.notifyUserPaymentConfirmed(saved, staffUsername);

        return toEnhancedResponse(saved);
    }

    @Override
    @Transactional
    public BookingResponse processPaymentSuccess(Integer bookingId) {
        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new DataNotFoundException("Booking not found"));

        booking.setStatus(BookingStatus.PAID.getValue());
        booking.setPaymentStatus(PaymentStatus.SUCCESS.getValue());
        booking.setPaidAt(LocalDateTime.now());

        if (!Boolean.TRUE.equals(booking.getCapacityDeducted())) {
            deductTourCapacity(booking);
            booking.setCapacityDeducted(true);
        }

        BookingEntity saved = bookingRepository.save(booking);
        log.info("Payment success processed for booking {}", booking.getBookingCode());

        notificationService.notifyUserBookingStatusChange(saved,
                "Your payment for booking " + saved.getBookingCode() + " has been successfully processed. Thank you!");

        return toEnhancedResponse(saved);
    }

    @Override
    @Transactional
    public BookingResponse processPaymentFailure(Integer bookingId, String reason) {
        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new DataNotFoundException("Booking not found"));

        booking.setPaymentStatus(PaymentStatus.FAILED.getValue());

        String existingNote = booking.getNote() != null ? booking.getNote() + "\n" : "";
        booking.setNote(existingNote + "[Payment Failed] " + reason);

        BookingEntity saved = bookingRepository.save(booking);
        log.info("Payment failure processed for booking {}: {}", booking.getBookingCode(), reason);

        return toEnhancedResponse(saved);
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(CancelBookingRequest request, String cancelledBy) {
        BookingEntity booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new DataNotFoundException("Booking not found"));

        if (booking.getStatus() == BookingStatus.CANCELLED.getValue()) {
            throw new RuntimeException("Booking is already cancelled");
        }
        if (booking.getStatus() == BookingStatus.COMPLETED.getValue()) {
            throw new RuntimeException("Cannot cancel a completed booking");
        }
        if (booking.getStatus() == BookingStatus.EXPIRED.getValue()) {
            throw new RuntimeException("Cannot cancel an expired booking");
        }

        if (Boolean.TRUE.equals(booking.getCapacityDeducted())) {
            restoreTourCapacity(booking);
            booking.setCapacityDeducted(false);
        }

        booking.setStatus(BookingStatus.CANCELLED.getValue());
        booking.setCancelledAt(LocalDateTime.now());
        booking.setCancelledBy(cancelledBy);
        booking.setCancellationReason(request.getReason());

        if (booking.getVoucher() != null) {
            voucherService.decrementUsageCount(booking.getVoucher());
        }

        BookingEntity saved = bookingRepository.save(booking);
        log.info("Booking {} cancelled by {}", booking.getBookingCode(), cancelledBy);

        notificationService.notifyUserBookingCancelled(saved, request.getReason(), cancelledBy);

        return toEnhancedResponse(saved);
    }

    @Override
    @Transactional
    public BookingResponse completeBooking(Integer bookingId) {
        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new DataNotFoundException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PAID.getValue()) {
            throw new RuntimeException("Only paid bookings can be marked as completed");
        }

        booking.setStatus(BookingStatus.COMPLETED.getValue());
        booking.setCompletedAt(LocalDateTime.now());

        BookingEntity saved = bookingRepository.save(booking);
        log.info("Booking {} marked as completed", booking.getBookingCode());

        notificationService.notifyUserBookingCompleted(saved);

        return toEnhancedResponse(saved);
    }

    @Override
    @Transactional
    public BookingResponse expireBooking(Integer bookingId) {
        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new DataNotFoundException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING_PAYMENT.getValue()) {
            throw new RuntimeException("Only pending payment bookings can be expired");
        }

        booking.setStatus(BookingStatus.EXPIRED.getValue());
        booking.setCancelledAt(LocalDateTime.now());
        booking.setCancelledBy("SYSTEM");
        booking.setCancellationReason("Booking expired due to payment timeout");

        if (booking.getVoucher() != null) {
            voucherService.decrementUsageCount(booking.getVoucher());
        }

        BookingEntity saved = bookingRepository.save(booking);
        log.info("Booking {} expired", booking.getBookingCode());

        notificationService.notifyUserBookingExpired(saved);

        return toEnhancedResponse(saved);
    }

    @Override
    @Transactional
    public int expireOverdueBookings() {
        LocalDateTime now = LocalDateTime.now();
        List<BookingEntity> expiredBookings = bookingRepository.findExpiredPendingPaymentBookings(
                BookingStatus.PENDING_PAYMENT.getValue(), now);

        int count = 0;
        for (BookingEntity booking : expiredBookings) {
            try {
                expireBooking(booking.getId());
                count++;
            } catch (Exception e) {
                log.error("Failed to expire booking {}: {}", booking.getBookingCode(), e.getMessage());
            }
        }

        if (count > 0) {
            log.info("Expired {} overdue bookings", count);
        }

        return count;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isBookingExpired(Integer bookingId) {
        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new DataNotFoundException("Booking not found"));
        return booking.isExpired();
    }

    @Override
    @Transactional
    public void deductTourCapacity(Integer bookingId) {
        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new DataNotFoundException("Booking not found"));
        deductTourCapacity(booking);
    }

    private void deductTourCapacity(BookingEntity booking) {
        for (BookingItemEntity item : booking.getItems()) {
            TourEntity tour = item.getTour();
            if (tour != null) {
                int adultCount = item.getAdultCount() != null ? item.getAdultCount() : 0;
                int childCount = item.getChildCount() != null ? item.getChildCount() : 0;
                int infantCount = item.getInfantCount() != null ? item.getInfantCount() : 0;

                int newRemainAdult = (tour.getRemainAdult() != null ? tour.getRemainAdult() : 0) - adultCount;
                int newRemainChild = (tour.getRemainChild() != null ? tour.getRemainChild() : 0) - childCount;
                int newRemainInfant = (tour.getRemainInfant() != null ? tour.getRemainInfant() : 0) - infantCount;

                tour.setRemainAdult(Math.max(0, newRemainAdult));
                tour.setRemainChild(Math.max(0, newRemainChild));
                tour.setRemainInfant(Math.max(0, newRemainInfant));

                tourRepository.save(tour);
                log.debug("Deducted capacity for tour {}: adults={}, children={}, infants={}",
                        tour.getId(), adultCount, childCount, infantCount);
            }
        }
    }

    @Override
    @Transactional
    public void restoreTourCapacity(Integer bookingId) {
        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new DataNotFoundException("Booking not found"));
        restoreTourCapacity(booking);
    }

    private void restoreTourCapacity(BookingEntity booking) {
        for (BookingItemEntity item : booking.getItems()) {
            TourEntity tour = item.getTour();
            if (tour != null) {
                int adultCount = item.getAdultCount() != null ? item.getAdultCount() : 0;
                int childCount = item.getChildCount() != null ? item.getChildCount() : 0;
                int infantCount = item.getInfantCount() != null ? item.getInfantCount() : 0;

                tour.setRemainAdult((tour.getRemainAdult() != null ? tour.getRemainAdult() : 0) + adultCount);
                tour.setRemainChild((tour.getRemainChild() != null ? tour.getRemainChild() : 0) + childCount);
                tour.setRemainInfant((tour.getRemainInfant() != null ? tour.getRemainInfant() : 0) + infantCount);

                tourRepository.save(tour);
                log.debug("Restored capacity for tour {}: adults={}, children={}, infants={}",
                        tour.getId(), adultCount, childCount, infantCount);
            }
        }
    }

    @Override
    @Transactional
    public int markCompletedBookings() {
        LocalDate today = LocalDate.now();
        List<BookingEntity> paidBookings = bookingRepository.findPaidBookings(BookingStatus.PAID.getValue());

        int count = 0;
        for (BookingEntity booking : paidBookings) {
            boolean allToursEnded = booking.getItems().stream().allMatch(item -> {
                if (item.getTour() == null || item.getDepartureDate() == null) return false;

                LocalDate departureDate = item.getDepartureDate();
                Integer duration = item.getTour().getDuration();

                if (duration == null) return false;

                LocalDate tourEndDate = departureDate.plusDays(duration);
                return tourEndDate.isBefore(today);
            });

            if (allToursEnded && !booking.getItems().isEmpty()) {
                try {
                    completeBooking(booking.getId());
                    count++;
                } catch (Exception e) {
                    log.error("Failed to complete booking {}: {}", booking.getBookingCode(), e.getMessage());
                }
            }
        }

        if (count > 0) {
            log.info("Marked {} bookings as completed", count);
        }

        return count;
    }

    @Override
    @Transactional(readOnly = true)
    public BookingListResponse getBookingsByStatus(Integer status, int offset, int limit) {
        PageRequest pageRequest = PageRequest.of(offset, limit, Sort.by("createdAt").descending());
        Page<BookingEntity> page = bookingRepository.findByStatus(status, pageRequest);

        List<BookingResponse> data = page.getContent().stream()
                .map(this::toEnhancedResponse)
                .toList();

        return BookingListResponse.builder()
                .data(data)
                .totalItems(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .currentPage(offset)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public BookingListResponse getPendingPaymentBookings(int offset, int limit) {
        return getBookingsByStatus(BookingStatus.PENDING_PAYMENT.getValue(), offset, limit);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingListResponse getBookingsExpiringSoon(int hours, int offset, int limit) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime threshold = now.plusHours(hours);

        PageRequest pageRequest = PageRequest.of(offset, limit, Sort.by("expirationTime").ascending());
        Page<BookingEntity> page = bookingRepository.findBookingsExpiringSoon(
                BookingStatus.PENDING_PAYMENT.getValue(), now, threshold, pageRequest);

        List<BookingResponse> data = page.getContent().stream()
                .map(this::toEnhancedResponse)
                .toList();

        return BookingListResponse.builder()
                .data(data)
                .totalItems(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .currentPage(offset)
                .build();
    }

    private BookingResponse toEnhancedResponse(BookingEntity entity) {
        BookingResponse response = bookingConverter.toResponse(entity);

        response.setStatusDescription(entity.getBookingStatus().getDescription());
        response.setPaymentStatusDescription(entity.getPaymentStatusEnum().getDescription());

        response.setBookingCode(entity.getBookingCode());

        response.setCreatedAt(entity.getCreatedAt());
        response.setExpirationTime(entity.getExpirationTime());
        response.setPaidAt(entity.getPaidAt());
        response.setCompletedAt(entity.getCompletedAt());
        response.setCancelledAt(entity.getCancelledAt());

        response.setCancellationReason(entity.getCancellationReason());
        response.setCancelledBy(entity.getCancelledBy());

        response.setConfirmedByStaff(entity.getConfirmedByStaff());

        response.setTotalAdults(entity.getTotalAdults());
        response.setTotalChildren(entity.getTotalChildren());
        response.setTotalInfants(entity.getTotalInfants());
        response.setTotalPassengers(entity.getTotalPassengers());

        response.setCapacityDeducted(entity.getCapacityDeducted());

        response.setCustomerEmail(entity.getCustomerEmail());
        response.setCustomerAddress(entity.getCustomerAddress());
        response.setSpecialRequests(entity.getSpecialRequests());

        response.setPaymentMethodName(entity.getPaymentMethod() != null ? entity.getPaymentMethod().getName() : null);

        response.setIsExpired(entity.isExpired());
        response.setCanCancel(canCancelBooking(entity));
        response.setCanPay(canPayBooking(entity));

        return response;
    }

    private boolean canCancelBooking(BookingEntity booking) {
        return booking.getStatus() == BookingStatus.PENDING_PAYMENT.getValue() ||
               booking.getStatus() == BookingStatus.PAID.getValue();
    }

    private boolean canPayBooking(BookingEntity booking) {
        return booking.getStatus() == BookingStatus.PENDING_PAYMENT.getValue() &&
               !booking.isExpired();
    }
}
