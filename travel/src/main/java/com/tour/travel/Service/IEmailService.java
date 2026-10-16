package com.tour.travel.Service;

public interface IEmailService {
    void sendOtpEmail(String toEmail, String otpCode);
    void sendPasswordResetConfirmation(String toEmail);
}
