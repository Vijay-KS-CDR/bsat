package com.broviders.bsat.service;

import com.broviders.bsat.dto.*;
import java.util.List;

/**
 * Service interface for handling Module 7 - Student Portal backend logic.
 * Provides read-only access for students to view their dashboard, tests, and results.
 */
public interface StudentPortalService {

    /**
     * Gets the dashboard details for the student.
     *
     * @param loginId the optional student login ID
     * @param userId  the optional student user ID
     * @return the dashboard response containing stats and info
     */
    StudentDashboardResponse getDashboard(String loginId, Long userId);

    /**
     * Gets all tests assigned to the student's class.
     *
     * @param loginId the optional student login ID
     * @param userId  the optional student user ID
     * @return a list of assigned or completed tests
     */
    List<StudentTestResponse> getAssignedTests(String loginId, Long userId);

    /**
     * Gets test details for a specific test.
     *
     * @param testId  the database test ID
     * @param loginId the optional student login ID
     * @param userId  the optional student user ID
     * @return the test details
     */
    StudentTestDetailResponse getTestDetails(Long testId, String loginId, Long userId);

    /**
     * Gets all completed test results for the student.
     *
     * @param loginId the optional student login ID
     * @param userId  the optional student user ID
     * @return a list of test results
     */
    List<StudentResultResponse> getResults(String loginId, Long userId);

    /**
     * Gets the result details for a specific completed test.
     *
     * @param testId  the database test ID
     * @param loginId the optional student login ID
     * @param userId  the optional student user ID
     * @return the result details
     */
    StudentResultDetailResponse getResultDetails(Long testId, String loginId, Long userId);
}
