package com.broviders.bsat.repository;

import com.broviders.bsat.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Data access repository for the Teacher entity.
 */
@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    /**
     * Find a teacher by their unique employee ID.
     *
     * @param employeeId the unique employee ID
     * @return an Optional containing the found Teacher, or empty
     */
    Optional<Teacher> findByEmployeeId(String employeeId);

    /**
     * Find teachers by their active status.
     *
     * @param status the status to search (ACTIVE/INACTIVE)
     * @return a list of teachers matching the status
     */
    List<Teacher> findByStatus(String status);

    /**
     * Checks if a teacher already exists with the given employee ID.
     *
     * @param employeeId the employee ID to check
     * @return true if a teacher exists, false otherwise
     */
    boolean existsByEmployeeId(String employeeId);
}
