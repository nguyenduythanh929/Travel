package com.tour.travel.Controller;

import com.tour.travel.dto.request.payment.VNPayPaymentRequest;
import com.tour.travel.dto.response.payment.VNPayCallbackResponse;
import com.tour.travel.dto.response.payment.VNPayPaymentResponse;
import com.tour.travel.Service.IVNPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/vnpay")
@RequiredArgsConstructor
public class VNPayController {

    private final IVNPayService vnPayService;

    @PostMapping("/create-payment")
    public ResponseEntity<VNPayPaymentResponse> createPayment(
            @RequestBody VNPayPaymentRequest request,
            HttpServletRequest httpRequest) {
        VNPayPaymentResponse response = vnPayService.createPayment(request, httpRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/callback")
    public ResponseEntity<VNPayCallbackResponse> vnpayCallback(@RequestParam Map<String, String> params) {
        VNPayCallbackResponse response = vnPayService.handleCallback(params);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ipn")
    public ResponseEntity<Map<String, String>> vnpayIPN(@RequestParam Map<String, String> params) {
        Map<String, String> result = new HashMap<>();

        try {
            VNPayCallbackResponse response = vnPayService.handleCallback(params);

            if ("00".equals(response.getCode())) {
                result.put("RspCode", "00");
                result.put("Message", "Confirm Success");
            } else {
                result.put("RspCode", "97");
                result.put("Message", "Invalid Signature");
            }
        } catch (Exception e) {
            result.put("RspCode", "99");
            result.put("Message", "Unknown error");
        }

        return ResponseEntity.ok(result);
    }
}
