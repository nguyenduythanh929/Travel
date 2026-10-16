package com.tour.travel.Controller;

import com.tour.travel.Exceptions.DataNotFoundException;
import com.tour.travel.dto.request.voucher.ApplyVoucherRequest;
import com.tour.travel.dto.request.voucher.VoucherRequest;
import com.tour.travel.dto.response.voucher.VoucherResponse;
import com.tour.travel.Service.IVoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final IVoucherService voucherService;

    @PostMapping("/bookings/{bookingId}/apply-voucher")
    public ResponseEntity<?> applyVoucher(
            @PathVariable Integer bookingId,
            @RequestBody ApplyVoucherRequest request
    ) {
        try {
            VoucherResponse voucher = voucherService.applyVoucherToBooking(bookingId, request.getVoucherCode());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Áp dụng voucher thành công");
            response.put("voucher", voucher);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Đã xảy ra lỗi khi áp dụng voucher");
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @DeleteMapping("/bookings/{bookingId}/remove-voucher")
    public ResponseEntity<?> removeVoucher(@PathVariable Integer bookingId) {
        try {
            voucherService.removeVoucherFromBooking(bookingId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Đã xóa voucher khỏi booking");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Đã xảy ra lỗi khi xóa voucher");
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("")
    public ResponseEntity<List<VoucherResponse>> getAllVouchers() {
        List<VoucherResponse> vouchers = voucherService.getAllVouchers();
        return ResponseEntity.ok(vouchers);
    }

    @PostMapping("")
    public ResponseEntity<?> createVoucher(@Valid @RequestBody VoucherRequest request) {
        try {
            VoucherResponse voucher = voucherService.createVoucher(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(voucher);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Đã xảy ra lỗi khi tạo voucher");
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("{code}")
    public ResponseEntity<?> getVoucherByCode(@PathVariable String code) {
        try {
            VoucherResponse voucher = voucherService.getVoucherByCode(code);
            return ResponseEntity.ok(voucher);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Không tìm thấy voucher");
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVoucher(@PathVariable Integer id) {
        try {
            voucherService.deleteVoucher(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Xóa voucher thành công");
            return ResponseEntity.ok(response);
        } catch (DataNotFoundException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Đã xảy ra lỗi khi xóa voucher");
            return ResponseEntity.internalServerError().body(error);
        }
    }
}
