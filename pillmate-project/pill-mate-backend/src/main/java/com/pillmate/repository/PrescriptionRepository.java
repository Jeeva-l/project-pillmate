package com.pillmate.repository;

import com.pillmate.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByUserId(Long userId);

    List<Prescription> findByUserIdOrderByIssuedDateDesc(Long userId);
}
