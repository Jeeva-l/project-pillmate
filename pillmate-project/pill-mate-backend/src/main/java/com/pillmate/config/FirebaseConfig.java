package com.pillmate.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import jakarta.annotation.PostConstruct;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);

    private final ResourceLoader resourceLoader;

    @Value("${firebase.project-id:}")
    private String expectedProjectId;

    @Value("${firebase.service-account-path:classpath:firebase-service-account.json}")
    private String serviceAccountPath;

    public FirebaseConfig(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @PostConstruct
    public void initializeFirebase() {
        if (!FirebaseApp.getApps().isEmpty()) {
            return;
        }

        try {
            Resource serviceAccount = resolveServiceAccount();
            try (InputStream stream = serviceAccount.getInputStream()) {
                GoogleCredentials credentials = GoogleCredentials.fromStream(stream);
                FirebaseOptions.Builder optionsBuilder = FirebaseOptions.builder()
                        .setCredentials(credentials);

                if (!expectedProjectId.isBlank()) {
                    optionsBuilder.setProjectId(expectedProjectId);
                }

                FirebaseOptions options = optionsBuilder
                        .build();

                FirebaseApp.initializeApp(options);
                logger.info("Firebase Admin SDK initialized using service account {}", serviceAccountPath);
            }
        } catch (Exception e) {
            logger.error("Firebase Admin SDK could not be initialized", e);
        }
    }

    private Resource resolveServiceAccount() {
        Resource resource = resourceLoader.getResource(serviceAccountPath);
        if (!resource.exists()) {
            throw new IllegalStateException("Firebase service account file not found at " + serviceAccountPath);
        }

        if (!expectedProjectId.isBlank()
                && serviceAccountPath.contains("firebase-service-account.json")
                && resource instanceof ClassPathResource) {
            logger.warn(
                    "Using bundled Firebase service account file. Ensure it belongs to Firebase project {}.",
                    expectedProjectId
            );
        }

        return resource;
    }
}
