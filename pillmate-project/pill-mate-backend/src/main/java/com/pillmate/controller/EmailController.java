package com.pillmate.controller;

import com.pillmate.service.EmailNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/email")
public class EmailController {
    @Autowired
    private EmailNotificationService emailService;

    @PostMapping("/send-reminder")
    public String sendReminder(@RequestParam String email,
                               @RequestParam String medicine,
                               @RequestParam String time) {
        emailService.sendMedicationReminder(email, medicine, time);
        return "Reminder Email Sent!";
    }

    @PostMapping("/send-missed")
    public String sendMissed(@RequestParam String email,
                             @RequestParam String medicine) {
        emailService.sendMissedAlert(email, medicine);
        return "Missed Alert Sent!";
    }

    @PostMapping("/welcome")
    public String sendWelcome(@RequestParam String email,
                              @RequestParam String name) {
        emailService.sendWelcomeEmail(email, name);
        return "Welcome Email Sent!";
    }
}
