package com.pillmate.controller;

import com.pillmate.model.Prescription;
import com.pillmate.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @GetMapping
    public List<Prescription> getPrescriptions(@RequestParam Long userId) {
        return prescriptionRepository.findByUserIdOrderByIssuedDateDesc(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getPrescription(@PathVariable Long id) {
        return prescriptionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Prescription createPrescription(@RequestBody Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prescription> updatePrescription(@PathVariable Long id,
            @RequestBody Prescription updated) {
        return prescriptionRepository.findById(id).map(p -> {
            p.setDoctorName(updated.getDoctorName());
            p.setMedicineName(updated.getMedicineName());
            p.setDosage(updated.getDosage());
            p.setInstructions(updated.getInstructions());
            p.setIssuedDate(updated.getIssuedDate());
            p.setExpiryDate(updated.getExpiryDate());
            p.setImageUrl(updated.getImageUrl());
            p.setActive(updated.getActive());
            return ResponseEntity.ok(prescriptionRepository.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePrescription(@PathVariable Long id) {
        return prescriptionRepository.findById(id).map(p -> {
            prescriptionRepository.delete(p);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
