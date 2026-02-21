package com.pillmate.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendMedicationReminder(String toEmail, String medicineName, String time) {
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
    }

    public void sendMissedAlert(String toEmail, String medicineName) {
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
    }

    public void sendWelcomeEmail(String toEmail, String userName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("🎉 Welcome to PillMate!");
        message.setText(
                "Hi " + userName + ",\n\n" +
                        "Welcome to PillMate – your smart medication reminder system!\n\n" +
                        "Start adding your medications and stay on track with your health goals.\n\n" +
                        "– The PillMate Team");
        mailSender.send(message);
    }
}
