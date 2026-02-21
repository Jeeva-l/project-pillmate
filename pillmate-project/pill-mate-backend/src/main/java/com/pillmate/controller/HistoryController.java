package com.pillmate.controller;

import com.pillmate.model.IntakeHistory;
import com.pillmate.repository.IntakeHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/history")
public class HistoryController {

    @Autowired
    private IntakeHistoryRepository historyRepository;

    @GetMapping
    public List<IntakeHistory> getHistory(@RequestParam Long userId) {
        return historyRepository.findByUserIdOrderByTakenAtDesc(userId);
    }

    @PostMapping
    public IntakeHistory logIntake(@RequestBody IntakeHistory history) {
        return historyRepository.save(history);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats(@RequestParam Long userId) {
        Map<String, Long> stats = new HashMap<>();
        stats.put("taken", historyRepository.countByUserIdAndStatus(userId, IntakeHistory.Status.TAKEN));
        stats.put("missed", historyRepository.countByUserIdAndStatus(userId, IntakeHistory.Status.MISSED));
        stats.put("skipped", historyRepository.countByUserIdAndStatus(userId, IntakeHistory.Status.SKIPPED));
        return ResponseEntity.ok(stats);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHistory(@PathVariable Long id) {
        return historyRepository.findById(id).map(h -> {
            historyRepository.delete(h);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
