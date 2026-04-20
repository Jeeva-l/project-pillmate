package com.pillmate.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(EmailNotificationService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendMedicationReminder(String toEmail, String medicineName, String time) {
        try {
            logger.info("Sending reminder email to: {}", toEmail);
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("💊 PillMate Medication Reminder");
            message.setText(
                    "Hello!\n\n" +
                            "This is a reminder to take your medication:\n\n" +
                            "  Medicine: " + medicineName + "\n" +
                            "  Scheduled Time: " + time + "\n\n" +
                            "Please log your intake in the PillMate app.\n\n" +
                            "Stay healthy! 💪\n" +
                            "– The PillMate Team");
            mailSender.send(message);
            logger.info("Reminder email successfully sent to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send reminder email to: {}. Error: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendMissedAlert(String toEmail, String medicineName) {
        try {
            logger.info("Sending missed medication alert to: {}", toEmail);
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("⚠️ PillMate – Missed Medication Alert");
            message.setText(
                    "Hello!\n\n" +
                            "You missed your medication today:\n\n" +
                            "  Medicine: " + medicineName + "\n\n" +
                            "Please consult your doctor if this happens frequently.\n\n" +
                            "– The PillMate Team");
            mailSender.send(message);
            logger.info("Missed alert successfully sent to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send missed alert to: {}. Error: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String userName) {
        try {
            logger.info("Sending welcome email to: {}", toEmail);
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("🎉 Welcome to PillMate!");
            message.setText(
                    "Hi " + userName + ",\n\n" +
                            "Welcome to PillMate – your smart medication reminder system!\n\n" +
                            "Start adding your medications and stay on track with your health goals.\n\n" +
                            "– The PillMate Team");
            mailSender.send(message);
            logger.info("Welcome email successfully sent to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send welcome email to: {}. Error: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetOtpEmail(String toEmail, String otp) {
        try {
            logger.info("Sending password reset email to: {}", toEmail);
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("🔒 PillMate - Password Reset OTP");
            message.setText("Hello,\n\nYou have requested to reset your password.\n" +
                    "Use this 6-digit OTP to continue:\n\n" + otp +
                    "\n\nThis OTP will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.\n\n" +
                    "– The PillMate Team");
            mailSender.send(message);
            logger.info("Password reset email successfully sent to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send password reset email to: {}. Error: {}", toEmail, e.getMessage());
        }
    }
}
