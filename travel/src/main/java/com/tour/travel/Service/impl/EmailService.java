package com.tour.travel.Service.impl;

import com.tour.travel.Service.IEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService implements IEmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendOtpEmail(String toEmail, String otpCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Mã OTP - Đặt lại mật khẩu");
            message.setText(
                    "Xin chào,\n\n" +
                            "Bạn đã yêu cầu đặt lại mật khẩu. Mã OTP của bạn là:\n\n" +
                            otpCode + "\n\n" +
                            "Mã này có hiệu lực trong 5 phút.\n\n" +
                            "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\n" +
                            "Trân trọng,\n" +
                            "Đội ngũ hỗ trợ"
            );

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Không thể gửi email: " + e.getMessage());
        }
    }

    @Override
    public void sendPasswordResetConfirmation(String toEmail) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Đặt lại mật khẩu thành công");
            message.setText(
                    """
                            Xin chào,

                            Mật khẩu của bạn đã được đặt lại thành công.

                            Nếu bạn không thực hiện thao tác này, vui lòng liên hệ với chúng tôi ngay lập tức.

                            Trân trọng,
                            Đội ngũ hỗ trợ"""
            );

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send confirmation email: " + e.getMessage());
        }
    }
}