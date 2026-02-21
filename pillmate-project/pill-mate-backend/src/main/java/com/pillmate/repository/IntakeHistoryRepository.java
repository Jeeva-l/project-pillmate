package com.pillmate.repository;

import com.pillmate.model.IntakeHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IntakeHistoryRepository extends JpaRepository<IntakeHistory, Long> {
    List<IntakeHistory> findByUserId(Long userId);

    List<IntakeHistory> findByUserIdOrderByTakenAtDesc(Long userId);

    List<IntakeHistory> findByUserIdAndTakenAtBetween(Long userId, LocalDateTime from, LocalDateTime to);

    long countByUserIdAndStatus(Long userId, IntakeHistory.Status status);
}
