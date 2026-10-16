package com.tour.travel.Service.impl;

import com.tour.travel.Configurations.VNPayConfig;
import com.tour.travel.Entity.BookingEntity;
import com.tour.travel.Entity.Enums.BookingStatus;
import com.tour.travel.Entity.VNPayTransactionEntity;
import com.tour.travel.Exceptions.DataNotFoundException;
import com.tour.travel.dto.request.payment.VNPayPaymentRequest;
import com.tour.travel.dto.response.payment.VNPayCallbackResponse;
import com.tour.travel.dto.response.payment.VNPayPaymentResponse;
import com.tour.travel.Repository.BookingRepository;
import com.tour.travel.Repository.VNPayTransactionRepository;
import com.tour.travel.Service.IBookingService;
import com.tour.travel.Service.IVNPayService;
import com.tour.travel.Utils.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Service implementation for VNPay payment processing.
 * Handles online payment creation, callback verification, and booking status updates.
 * Tour capacity is deducted only after successful payment.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class VNPayService implements IVNPayService {

    private final VNPayConfig vnPayConfig;
    private final VNPayTransactionRepository transactionRepository;
    private final BookingRepository bookingRepository;
    private final IBookingService bookingService;

    @Override
    @Transactional
    public VNPayPaymentResponse createPayment(VNPayPaymentRequest request, HttpServletRequest httpRequest) {
        try {
            BookingEntity booking = bookingRepository.findById(request.getBookingId())
                    .orElseThrow(() -> new DataNotFoundException("Booking not found"));
            String vnpTxnRef = VNPayUtil.getRandomNumber(8);

            long amount;
            if (request.getAmount() != null) {
                amount = request.getAmount();
            } else {
                amount = booking.getFinalPrice().longValue();
            }

            Map<String, String> vnpParams = new HashMap<>();
            vnpParams.put("vnp_Version", vnPayConfig.getVersion());
            vnpParams.put("vnp_Command", vnPayConfig.getCommand());
            vnpParams.put("vnp_TmnCode", vnPayConfig.getTmnCode());
            vnpParams.put("vnp_Amount", String.valueOf(amount * 100));
            vnpParams.put("vnp_CurrCode", "VND");
            if (request.getBankCode() != null && !request.getBankCode().isEmpty()) {
                vnpParams.put("vnp_BankCode", request.getBankCode());
            }
            vnpParams.put("vnp_TxnRef", vnpTxnRef);
            vnpParams.put("vnp_OrderInfo", request.getOrderInfo() != null ? request.getOrderInfo() : "Thanh toan booking #" + booking.getId());
            vnpParams.put("vnp_OrderType", vnPayConfig.getOrderType());
            vnpParams.put("vnp_Locale", "vn");
            vnpParams.put("vnp_ReturnUrl", request.getReturnUrl() != null ? request.getReturnUrl() : vnPayConfig.getReturnUrl());
            vnpParams.put("vnp_IpAddr", VNPayUtil.getIpAddress(httpRequest));
            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnpCreateDate = formatter.format(cld.getTime());
            vnpParams.put("vnp_CreateDate", vnpCreateDate);
            cld.add(Calendar.MINUTE, 15); // Expire sau 15 phút
            String vnpExpireDate = formatter.format(cld.getTime());
            vnpParams.put("vnp_ExpireDate", vnpExpireDate);
            List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = vnpParams.get(fieldName);
                if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                }
            }

            String queryUrl = query.toString();
            String vnpSecureHash = VNPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
            queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
            String paymentUrl = vnPayConfig.getVnpUrl() + "?" + queryUrl;

            VNPayTransactionEntity transaction = new VNPayTransactionEntity();
            transaction.setBooking(booking);
            transaction.setVnpTxnRef(vnpTxnRef);
            transaction.setVnpAmount(amount * 100);
            transaction.setVnpBankCode(request.getBankCode());
            transaction.setVnpOrderInfo(vnpParams.get("vnp_OrderInfo"));
            transaction.setPaymentUrl(paymentUrl);
            transaction.setStatus(0);
            transaction.setIpAddress(VNPayUtil.getIpAddress(httpRequest));
            transactionRepository.save(transaction);
            return VNPayPaymentResponse.builder()
                    .code("00")
                    .message("Success")
                    .paymentUrl(paymentUrl)
                    .vnpTxnRef(vnpTxnRef)
                    .build();

        } catch (Exception e) {
            return VNPayPaymentResponse.builder()
                    .code("99")
                    .message("Error: " + e.getMessage())
                    .build();
        }
    }

    @Override
    public boolean verifyCallback(Map<String, String> params) {
        try {
            String vnpSecureHash = params.get("vnp_SecureHash");
            params.remove("vnp_SecureHashType");
            params.remove("vnp_SecureHash");

            List<String> fieldNames = new ArrayList<>(params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();

            Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = params.get(fieldName);
                if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                    if (itr.hasNext()) {
                        hashData.append('&');
                    }
                }
            }

            String signValue = VNPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
            return signValue.equals(vnpSecureHash);
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    @Transactional
    public VNPayCallbackResponse handleCallback(Map<String, String> params) {
        try {
            if (!verifyCallback(params)) {
                log.warn("VNPay callback: Invalid signature");
                return VNPayCallbackResponse.builder()
                        .code("97")
                        .message("Invalid signature")
                        .build();
            }

            String vnpTxnRef = params.get("vnp_TxnRef");
            String vnpResponseCode = params.get("vnp_ResponseCode");
            String vnpTransactionNo = params.get("vnp_TransactionNo");
            String vnpAmount = params.get("vnp_Amount");
            String vnpBankCode = params.get("vnp_BankCode");
            String vnpPayDate = params.get("vnp_PayDate");
            String vnpCardType = params.get("vnp_CardType");

            VNPayTransactionEntity transaction = transactionRepository.findByVnpTxnRef(vnpTxnRef)
                    .orElseThrow(() -> new DataNotFoundException("Transaction not found"));

            transaction.setVnpResponseCode(vnpResponseCode);
            transaction.setVnpTransactionNo(vnpTransactionNo);
            transaction.setVnpPayDate(vnpPayDate);
            transaction.setVnpCardType(vnpCardType);

            if (vnpPayDate != null) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
                transaction.setPaymentTime(LocalDateTime.parse(vnpPayDate, formatter));
            }

            BookingEntity booking = transaction.getBooking();
            String bookingStatusDesc;

            if ("00".equals(vnpResponseCode)) {
                // Payment successful - update via BookingService (handles capacity deduction)
                transaction.setStatus(1);
                transactionRepository.save(transaction);

                try {
                    bookingService.processPaymentSuccess(booking.getId());
                    bookingStatusDesc = BookingStatus.PAID.getDescription();
                    log.info("VNPay payment successful for booking {}", booking.getBookingCode());
                } catch (Exception e) {
                    log.error("Failed to process payment success for booking {}: {}", booking.getBookingCode(), e.getMessage());
                    bookingStatusDesc = "Payment processed but status update failed";
                }
            } else {
                // Payment failed
                transaction.setStatus(2);
                transactionRepository.save(transaction);

                try {
                    bookingService.processPaymentFailure(booking.getId(), getResponseMessage(vnpResponseCode));
                    bookingStatusDesc = BookingStatus.PENDING_PAYMENT.getDescription();
                    log.warn("VNPay payment failed for booking {}: {}", booking.getBookingCode(), vnpResponseCode);
                } catch (Exception e) {
                    log.error("Failed to process payment failure for booking {}: {}", booking.getBookingCode(), e.getMessage());
                    bookingStatusDesc = "Payment failed";
                }
            }

            // Reload booking to get updated status
            booking = bookingRepository.findById(booking.getId()).orElse(booking);

            return VNPayCallbackResponse.builder()
                    .code(vnpResponseCode)
                    .message(getResponseMessage(vnpResponseCode))
                    .vnpTxnRef(vnpTxnRef)
                    .vnpTransactionNo(vnpTransactionNo)
                    .vnpAmount(Long.parseLong(vnpAmount))
                    .vnpResponseCode(vnpResponseCode)
                    .vnpBankCode(vnpBankCode)
                    .vnpPayDate(vnpPayDate)
                    .vnpCardType(vnpCardType)
                    .bookingId(booking.getId())
                    .bookingStatus(bookingStatusDesc)
                    .build();

        } catch (Exception e) {
            log.error("VNPay callback error", e);
            return VNPayCallbackResponse.builder()
                    .code("99")
                    .message("Error: " + e.getMessage())
                    .build();
        }
    }

    private String getResponseMessage(String responseCode) {
        return switch (responseCode) {
            case "00" -> "Giao dịch thành công";
            case "07" -> "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).";
            case "09" ->
                    "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.";
            case "10" ->
                    "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần";
            case "11" ->
                    "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.";
            case "12" -> "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.";
            case "13" ->
                    "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.";
            case "24" -> "Giao dịch không thành công do: Khách hàng hủy giao dịch";
            case "51" ->
                    "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.";
            case "65" ->
                    "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.";
            case "75" -> "Ngân hàng thanh toán đang bảo trì.";
            case "79" ->
                    "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch";
            default -> "Giao dịch không thành công";
        };
    }
}
