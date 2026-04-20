package com.pillmate.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.pillmate.model.User;
import com.pillmate.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    @Autowired
    private UserRepository userRepository;

    /**
     * Sends a push notification to a specific user using Firebase Cloud Messaging.
     *
     * @param userId The ID of the user to send the notification to.
     * @param title  The title of the notification.
     * @param body   The body content of the notification.
     */
    public void sendPushNotification(Long userId, String title, String body) {
        // Fetch user from database
        userRepository.findById(userId).ifPresentOrElse(user -> {
            String token = user.getFcmToken();
            
            // Check if user has an active FCM token registered
            if (token != null && !token.isEmpty()) {
                try {
                    // Build the FCM notification Request
                    Notification notification = Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build();

                    // Build the Message payload
                    Message message = Message.builder()
                            .setToken(token)
                            .setNotification(notification)
                            .putData("click_action", "/dashboard")
                            .putData("userId", String.valueOf(userId))
                            .putData("title", title)
                            .putData("body", body)
                            .build();

                    // Send the message asynchronously (can be synchronous too)
                    String response = FirebaseMessaging.getInstance().send(message);
                    logger.info("Successfully sent notification to user {}: {}", userId, response);
                } catch (Exception e) {
                    logger.error("Failed to send notification to user {}", userId, e);
                }
            } else {
                logger.warn("User {} does not have an FCM token registered. Cannot send notification.", userId);
            }
        }, () -> {
            logger.warn("User with ID {} not found for notification sending.", userId);
        });
    }
}
