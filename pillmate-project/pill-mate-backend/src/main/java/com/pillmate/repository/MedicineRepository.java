package com.pillmate.repository;

import com.pillmate.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    List<Medicine> findByUserId(Long userId);

    List<Medicine> findByUserIdAndActive(Long userId, Boolean active);
}
