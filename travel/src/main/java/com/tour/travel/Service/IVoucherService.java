package com.tour.travel.Service;

import com.tour.travel.Entity.VoucherEntity;
import com.tour.travel.dto.request.voucher.VoucherRequest;
import com.tour.travel.dto.response.voucher.VoucherResponse;

import java.util.List;

public interface IVoucherService {
    VoucherEntity validateAndGetVoucher(String code, Double totalPrice);
    Double calculateDiscount(VoucherEntity voucher, Double totalPrice);
    VoucherResponse applyVoucherToBooking(Integer bookingId, String voucherCode);
    void removeVoucherFromBooking(Integer bookingId);
    VoucherResponse getVoucherByCode(String code);
    List<VoucherResponse> getAllVouchers();
    void incrementUsageCount(VoucherEntity voucher);
    void decrementUsageCount(VoucherEntity voucher);
    VoucherResponse createVoucher(VoucherRequest request);
    void deleteVoucher(Integer id);
}
