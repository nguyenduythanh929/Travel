package com.tour.travel.Service.impl;

import com.tour.travel.Entity.BookingEntity;
import com.tour.travel.Entity.VoucherEntity;
import com.tour.travel.Exceptions.DataNotFoundException;
import com.tour.travel.dto.request.voucher.VoucherRequest;
import com.tour.travel.dto.response.voucher.VoucherResponse;
import com.tour.travel.Repository.BookingRepository;
import com.tour.travel.Repository.VoucherRepository;
import com.tour.travel.Service.IVoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VoucherService implements IVoucherService {

    private final VoucherRepository voucherRepository;
    private final BookingRepository bookingRepository;

    @Override
    public VoucherEntity validateAndGetVoucher(String code, Double totalPrice) {
        VoucherEntity voucher = voucherRepository.findValidVoucherByCode(code, LocalDateTime.now())
                .orElseThrow(() -> new IllegalArgumentException("Mã voucher không hợp lệ hoặc đã hết hạn"));

        if (!voucher.getIsActive()) {
            throw new IllegalArgumentException("Mã voucher không còn hiệu lực");
        }

        if (totalPrice != null && voucher.getMinPurchaseAmount() != null && totalPrice < voucher.getMinPurchaseAmount()) {
            throw new IllegalArgumentException(
                    String.format("Giá trị đơn hàng tối thiểu phải từ %.0f VNĐ", voucher.getMinPurchaseAmount())
            );
        }

        if (voucher.getUsageLimit() != null && voucher.getUsageCount() >= voucher.getUsageLimit()) {
            throw new IllegalArgumentException("Mã voucher đã hết lượt sử dụng");
        }

        return voucher;
    }

    @Override
    public Double calculateDiscount(VoucherEntity voucher, Double totalPrice) {
        double discount;

        if (voucher.getDiscountType() == VoucherEntity.DiscountType.PERCENTAGE) {
            discount = totalPrice * (voucher.getDiscountValue() / 100.0);
            if (voucher.getMaxDiscountAmount() != null && discount > voucher.getMaxDiscountAmount()) {
                discount = voucher.getMaxDiscountAmount();
            }
        } else {
            discount = voucher.getDiscountValue();
        }

        if (discount > totalPrice) {
            discount = totalPrice;
        }

        return discount;
    }

    @Override
    @Transactional
    public VoucherResponse applyVoucherToBooking(Integer bookingId, String voucherCode) {
        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy booking với id: " + bookingId));

        VoucherEntity oldVoucher = booking.getVoucher();
        if (oldVoucher != null) {
            decrementUsageCount(oldVoucher);
        }

        VoucherEntity voucher = validateAndGetVoucher(voucherCode, booking.getTotalPrice());

        Double discount = calculateDiscount(voucher, booking.getTotalPrice());

        booking.setVoucher(voucher);
        booking.setVoucherCode(voucherCode);
        booking.setDiscount(discount);
        booking.setFinalPrice(booking.getTotalPrice() - discount);

        incrementUsageCount(voucher);

        bookingRepository.save(booking);

        return toResponse(voucher);
    }

    @Override
    @Transactional
    public void removeVoucherFromBooking(Integer bookingId) {
        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy booking với id: " + bookingId));

        if (booking.getVoucher() != null) {
            decrementUsageCount(booking.getVoucher());
        }

        booking.setVoucher(null);
        booking.setVoucherCode(null);
        booking.setDiscount(0.0);
        booking.setFinalPrice(booking.getTotalPrice());

        bookingRepository.save(booking);
    }

    @Override
    public VoucherResponse getVoucherByCode(String code) {
        VoucherEntity voucher = voucherRepository.findByCode(code)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy voucher với mã: " + code));
        return toResponse(voucher);
    }

    @Override
    public List<VoucherResponse> getAllVouchers() {
        return voucherRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void incrementUsageCount(VoucherEntity voucher) {
        voucher.setUsageCount(voucher.getUsageCount() + 1);
        voucherRepository.save(voucher);
    }

    @Override
    @Transactional
    public void decrementUsageCount(VoucherEntity voucher) {
        if (voucher.getUsageCount() > 0) {
            voucher.setUsageCount(voucher.getUsageCount() - 1);
            voucherRepository.save(voucher);
        }
    }

    @Override
    @Transactional
    public VoucherResponse createVoucher(VoucherRequest request) {
        if (voucherRepository.findByCode(request.getCode()).isPresent()) {
            throw new IllegalArgumentException("Mã voucher đã tồn tại");
        }

        VoucherEntity voucher = new VoucherEntity();
        voucher.setCode(request.getCode());
        voucher.setDescription(request.getDescription());
        voucher.setDiscountType(VoucherEntity.DiscountType.valueOf(request.getDiscountType()));
        voucher.setDiscountValue(request.getDiscountValue());
        voucher.setMinPurchaseAmount(request.getMinPurchaseAmount());
        voucher.setMaxDiscountAmount(request.getMaxDiscountAmount());
        voucher.setValidFrom(request.getValidFrom());
        voucher.setValidTo(request.getValidTo());
        voucher.setUsageLimit(request.getUsageLimit());
        voucher.setUsageCount(0);
        voucher.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

        VoucherEntity saved = voucherRepository.save(voucher);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteVoucher(Integer id) {
        VoucherEntity voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy voucher với id: " + id));
        voucherRepository.delete(voucher);
    }

    private VoucherResponse toResponse(VoucherEntity voucher) {
        return VoucherResponse.builder()
                .id(voucher.getId())
                .code(voucher.getCode())
                .description(voucher.getDescription())
                .discountType(voucher.getDiscountType().toString())
                .discountValue(voucher.getDiscountValue())
                .minPurchaseAmount(voucher.getMinPurchaseAmount())
                .maxDiscountAmount(voucher.getMaxDiscountAmount())
                .validFrom(voucher.getValidFrom())
                .validTo(voucher.getValidTo())
                .usageLimit(voucher.getUsageLimit())
                .usageCount(voucher.getUsageCount())
                .isActive(voucher.getIsActive())
                .build();
    }
}
