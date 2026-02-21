package com.pillmate.service;

import com.pillmate.model.IntakeHistory;
import com.pillmate.model.Medicine;
import com.pillmate.repository.IntakeHistoryRepository;
import com.pillmate.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReminderScheduler {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private IntakeHistoryRepository historyRepository;

    @Autowired
    private EmailNotificationService emailService;

    /**
     * Runs every day at 11:59 PM to mark any unchecked active medicines as MISSED.
     */
    @Scheduled(cron = "0 59 23 * * *")
    public void checkMissedMedications() {
        List<Medicine> activeMedicines = medicineRepository.findAll().stream()
                .filter(m -> Boolean.TRUE.equals(m.getActive()))
                .filter(m -> m.getEndDate() == null || !m.getEndDate().isBefore(LocalDate.now()))
                .toList();

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusHours(23).plusMinutes(58);

        for (Medicine medicine : activeMedicines) {
            List<IntakeHistory> todayHistory = historyRepository
                    .findByUserIdAndTakenAtBetween(medicine.getUserId(), startOfDay, endOfDay);

            boolean hasTodayEntry = todayHistory.stream()
                    .anyMatch(h -> h.getMedicineId().equals(medicine.getId()));

            if (!hasTodayEntry) {
                IntakeHistory missed = new IntakeHistory();
                missed.setUserId(medicine.getUserId());
                missed.setMedicineId(medicine.getId());
                missed.setMedicineName(medicine.getName());
                missed.setStatus(IntakeHistory.Status.MISSED);
                missed.setTakenAt(LocalDateTime.now());
                historyRepository.save(missed);
            }
        }
    }
}
