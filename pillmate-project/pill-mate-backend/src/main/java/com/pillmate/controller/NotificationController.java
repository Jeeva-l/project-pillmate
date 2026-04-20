package com.pillmate.controller;

import com.pillmate.dto.ApiResponse;
import com.pillmate.dto.PushTokenRequest;
import com.pillmate.model.User;
import com.pillmate.repository.UserRepository;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);

    private final UserRepository userRepository;

    public NotificationController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register-token")
    public ResponseEntity<ApiResponse> registerToken(@Valid @RequestBody PushTokenRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFcmToken(request.getToken());
        userRepository.save(user);
        logger.info("Registered FCM token for user {} (length={})", user.getId(), request.getToken().length());

        return ResponseEntity.ok(new ApiResponse(true, "Push notification token registered"));
    }
}
