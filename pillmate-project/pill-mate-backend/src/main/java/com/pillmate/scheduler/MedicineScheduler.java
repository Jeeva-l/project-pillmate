package com.pillmate.scheduler;

import com.pillmate.model.Medicine;
import com.pillmate.repository.MedicineRepository;
import com.pillmate.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
public class MedicineScheduler {

    private static final Logger logger = LoggerFactory.getLogger(MedicineScheduler.class);

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private NotificationService notificationService;

    /**
     * Runs every minute at the start of the minute (0 seconds).
     * Retrieves all active medicines to check if they need a notification.
     */
    @Transactional
    @Scheduled(cron = "0 * * * * *")
    public void scheduleMedicineNotifications() {
        logger.debug("Running medicine notification scheduler...");
        
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now().withSecond(0).withNano(0); // Ignore seconds & nanos
        
        // Fetch only active medicines
        List<Medicine> activeMedicines = medicineRepository.findByActiveTrue();
        
        for (Medicine medicine : activeMedicines) {
            // Check if today is within startDate and endDate
            if (medicine.getStartDate() != null && today.isBefore(medicine.getStartDate())) {
                continue; // Not yet time to start taking this medication
            }
            if (medicine.getEndDate() != null && today.isAfter(medicine.getEndDate())) {
                continue; // Medication course has already ended
            }
            
            // Loop through intakeTimes
            if (medicine.getIntakeTimes() != null && !medicine.getIntakeTimes().isEmpty()) {
                for (String timeStr : medicine.getIntakeTimes()) {
                    try {
                        LocalTime intakeTime = LocalTime.parse(timeStr).withSecond(0).withNano(0);
                        
                        // Compare intake time with current time (ignore seconds)
                        if (now.equals(intakeTime)) {
                            // Prevent duplicate notifications using lastNotifiedTime
                            if (isAlreadyNotified(medicine, today, now)) {
                                continue; 
                            }
                            
                            // Validate frequency (DAILY / WEEKLY logic)
                            if (isFrequencyValid(medicine, today)) {
                                // Prepare notification payloads
                                String title = "Time for your medicine: " + medicine.getName();
                                String body = "Please take your dosage of " + medicine.getDosage() + ". Don't forget!";
                                
                                // Trigger notification
                                notificationService.sendPushNotification(medicine.getUserId(), title, body);
                                
                                // Update last notified time and prevent future duplicates for this minute
                                medicine.setLastNotifiedTime(LocalDateTime.of(today, now));
                                medicineRepository.save(medicine);
                                
                                // Break outer loop for intake times if already sent for this minute
                                break; 
                            }
                        }
                    } catch (Exception e) {
                        logger.error("Error parsing intake time {} for medicine ID {}", timeStr, medicine.getId(), e);
                    }
                }
            }
        }
    }

    /**
     * Checks if the notification has already been sent for the exact given current time limit.
     */
    private boolean isAlreadyNotified(Medicine medicine, LocalDate today, LocalTime now) {
        LocalDateTime lastTime = medicine.getLastNotifiedTime();
        if (lastTime == null) {
            return false;
        }
        
        // If last time was today and at the same minute, we already sent it
        return lastTime.toLocalDate().equals(today) && lastTime.toLocalTime().withSecond(0).withNano(0).equals(now);
    }

    /**
     * Validates if the medicine should be taken today based on its frequency setting.
     * 
     * @param medicine  The medicine entity.
     * @param today     The current date.
     * @return true if the notification should be triggered today; false otherwise.
     */
    private boolean isFrequencyValid(Medicine medicine, LocalDate today) {
        String freq = medicine.getFrequency();
        if (freq == null) {
            return false;
        }

        if ("DAILY".equalsIgnoreCase(freq)) {
            return true;
        } else if ("WEEKLY".equalsIgnoreCase(freq)) {
            // WEEKLY check: Check if current date falls on the same day of week as the start date
            if (medicine.getStartDate() != null) {
                return medicine.getStartDate().getDayOfWeek() == today.getDayOfWeek();
            } else {
                return false; 
            }
        } else if ("CUSTOM".equalsIgnoreCase(freq)) {
            // Place your logic for 'CUSTOM' frequency here.
            // Example: read from another column representing days offset
            return false;
        }
        
        return false;
    }
}
