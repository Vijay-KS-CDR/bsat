package com.broviders.bsat.service;

import com.broviders.bsat.dto.AnswerReviewResponse;

/**
 * Service interface for handling Detailed Answer Review logic (Module 10).
 */
public interface ResultReviewService {
    /**
     * Retrieves the detailed question-by-question review of a student's completed test attempt.
     * Enforces role-based access control and business constraints.
     *
     * @param attemptId the ID of the test attempt
     * @param currentUserId the ID of the authenticated user requesting the review
     * @return the mapped AnswerReviewResponse DTO
     */
    AnswerReviewResponse getAnswerReview(Long attemptId, Long currentUserId);
}
