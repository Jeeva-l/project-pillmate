package com.pillmate.controller;

import com.pillmate.model.Medicine;
import com.pillmate.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    @Autowired
    private MedicineRepository medicineRepository;

    @GetMapping
    public List<Medicine> getAllMedicines(@RequestParam Long userId) {
        return medicineRepository.findByUserId(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getMedicineById(@PathVariable Long id) {
        return medicineRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Medicine createMedicine(@RequestBody Medicine medicine) {
        return medicineRepository.save(medicine);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medicine> updateMedicine(@PathVariable Long id, @RequestBody Medicine updated) {
        return medicineRepository.findById(id).map(medicine -> {
            medicine.setName(updated.getName());
            medicine.setDosage(updated.getDosage());
            medicine.setFrequency(updated.getFrequency());
            medicine.setIntakeTimes(updated.getIntakeTimes());
            medicine.setStartDate(updated.getStartDate());
            medicine.setEndDate(updated.getEndDate());
            medicine.setActive(updated.getActive());
            medicine.setNotes(updated.getNotes());
            medicine.setCategory(updated.getCategory());
            return ResponseEntity.ok(medicineRepository.save(medicine));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable Long id) {
        return medicineRepository.findById(id).map(medicine -> {
            medicineRepository.delete(medicine);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/active")
    public List<Medicine> getActiveMedicines(@RequestParam Long userId) {
        return medicineRepository.findByUserIdAndActive(userId, true);
    }
}
