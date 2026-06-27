package com.broviders.bsat.service;

import com.broviders.bsat.dto.*;
import java.util.List;

/**
 * Service interface for handling student management business operations.
 */
public interface StudentService {

    /**
     * Creates a new student and also spawns their corresponding user account.
     *
     * @param request the create request details
     * @return the created student details response
     */
    StudentResponse createStudent(CreateStudentRequest request);

    /**
     * Retrieves a student by their ID.
     *
     * @param id the student database identifier
     * @return the student details response
     */
    StudentResponse getStudentById(Long id);

    /**
     * Lists all registered student records.
     *
     * @return list of student details response
     */
    List<StudentResponse> getAllStudents();

    /**
     * Updates an existing student record and their associated user details.
     *
     * @param id      the student identifier to update
     * @param request the update details
     * @return the updated student details response
     */
    StudentResponse updateStudent(Long id, UpdateStudentRequest request);

    /**
     * Deletes a student record and their associated user identity record.
     *
     * @param id the student identifier to remove
     */
    void deleteStudent(Long id);

    /**
     * Updates only the active status of a student profile.
     *
     * @param id     the student identifier
     * @param status the new status (ACTIVE/INACTIVE)
     * @return the updated student details response
     */
    StudentResponse updateStudentStatus(Long id, String status);
}
