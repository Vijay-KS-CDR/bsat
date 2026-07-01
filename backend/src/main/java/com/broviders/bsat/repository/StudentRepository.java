package com.broviders.bsat.repository;

import com.broviders.bsat.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Data access repository for the Student entity.
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    /**
     * Find a student by their unique admission number.
     *
     * @param admissionNumber the unique admission number
     * @return an Optional containing the found Student, or empty
     */
    Optional<Student> findByAdmissionNumber(String admissionNumber);

    /**
     * Checks if a student already exists with the given admission number.
     *
     * @param admissionNumber the admission number to check
     * @return true if a student exists, false otherwise
     */
    boolean existsByAdmissionNumber(String admissionNumber);

    /**
     * Find a student by their associated User ID.
     *
     * @param userId the user ID to check
     * @return an Optional containing the found Student, or empty
     */
    java.util.Optional<Student> findByUserId(Long userId);
}
