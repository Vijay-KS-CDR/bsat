package com.broviders.bsat.controller;

import com.broviders.bsat.dto.ApiResponse;
import com.broviders.bsat.dto.AnswerReviewResponse;
import com.broviders.bsat.service.ResultReviewService;
import com.broviders.bsat.exception.AccessDeniedException;
import com.broviders.bsat.exception.ResourceNotFoundException;
import com.broviders.bsat.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * Controller exposing endpoints for Detailed Answer Review (Module 10).
 */
@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResultReviewController {

    private final ResultReviewService resultReviewService;

    /**
     * Endpoint to retrieve the detailed answer review for a completed test attempt.
     * Accessible by students (own attempts only), teachers, and admins.
     *
     * @param currentUserId the ID of the authenticated user requesting the review
     * @param attemptId the ID of the attempt to review
     * @return the ApiResponse containing AnswerReviewResponse
     */
    @GetMapping("/review/{attemptId}")
    public ResponseEntity<ApiResponse<AnswerReviewResponse>> getAnswerReview(
            @PathVariable Long attemptId) {
        try {
            Long userId = null;
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof CustomUserDetails) {
                userId = ((CustomUserDetails) auth.getPrincipal()).getUserId();
            }
            AnswerReviewResponse response = resultReviewService.getAnswerReview(attemptId, userId);
            
            ApiResponse<AnswerReviewResponse> apiResponse = ApiResponse.<AnswerReviewResponse>builder()
                    .success(true)
                    .message("Answer review fetched successfully")
                    .data(response)
                    .build();
            
            return ResponseEntity.ok(apiResponse);
        } catch (ResourceNotFoundException e) {
            ApiResponse<AnswerReviewResponse> apiResponse = ApiResponse.<AnswerReviewResponse>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
        } catch (AccessDeniedException e) {
            ApiResponse<AnswerReviewResponse> apiResponse = ApiResponse.<AnswerReviewResponse>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(apiResponse);
        } catch (IllegalArgumentException e) {
            ApiResponse<AnswerReviewResponse> apiResponse = ApiResponse.<AnswerReviewResponse>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<AnswerReviewResponse> apiResponse = ApiResponse.<AnswerReviewResponse>builder()
                    .success(false)
                    .message("An unexpected error occurred: " + e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }
}
