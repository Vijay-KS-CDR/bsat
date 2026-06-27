package com.broviders.bsat.service;

import com.broviders.bsat.dto.*;
import java.util.List;

/**
 * Service interface for handling teacher management business operations.
 */
public interface TeacherService {

    /**
     * Creates a new teacher and also spawns their corresponding user account.
     *
     * @param request the create request details
     * @return the created teacher details response
     */
    TeacherResponse createTeacher(CreateTeacherRequest request);

    /**
     * Retrieves a teacher by their ID.
     *
     * @param id the teacher database identifier
     * @return the teacher details response
     */
    TeacherResponse getTeacherById(Long id);

    /**
     * Lists all registered teacher records.
     *
     * @return list of teacher details response
     */
    List<TeacherResponse> getAllTeachers();

    /**
     * Updates an existing teacher record and their associated user details.
     *
     * @param id      the teacher identifier to update
     * @param request the update details
     * @return the updated teacher details response
     */
    TeacherResponse updateTeacher(Long id, UpdateTeacherRequest request);

    /**
     * Deletes a teacher record and their associated user identity record.
     *
     * @param id the teacher identifier to remove
     */
    void deleteTeacher(Long id);

    /**
     * Updates only the active status of a teacher profile.
     *
     * @param id     the teacher identifier
     * @param status the new status (ACTIVE/INACTIVE)
     * @return the updated teacher details response
     */
    TeacherResponse updateTeacherStatus(Long id, String status);
}
