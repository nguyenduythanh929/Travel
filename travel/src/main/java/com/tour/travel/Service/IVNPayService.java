package com.tour.travel.Service;

import com.tour.travel.dto.request.payment.VNPayPaymentRequest;
import com.tour.travel.dto.response.payment.VNPayCallbackResponse;
import com.tour.travel.dto.response.payment.VNPayPaymentResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

public interface IVNPayService {
    VNPayPaymentResponse createPayment(VNPayPaymentRequest request, HttpServletRequest httpRequest);
    VNPayCallbackResponse handleCallback(Map<String, String> params);
    boolean verifyCallback(Map<String, String> params);
}