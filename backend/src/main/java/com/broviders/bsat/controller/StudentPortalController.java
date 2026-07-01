package com.broviders.bsat.controller;

import com.broviders.bsat.dto.*;
import com.broviders.bsat.service.StudentPortalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.broviders.bsat.security.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller exposing read-only endpoints for the Student Portal (Module 7).
 */
@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentPortalController {

    private final StudentPortalService studentPortalService;

    /**
     * Endpoint to view the dashboard summary.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        try {
            String loginId = resolveLoginId();
            Long userId = resolveUserId();
            StudentDashboardResponse response = studentPortalService.getDashboard(loginId, userId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Endpoint to view assigned and completed tests.
     */
    @GetMapping("/tests")
    public ResponseEntity<?> getAssignedTests() {
        try {
            String loginId = resolveLoginId();
            Long userId = resolveUserId();
            List<StudentTestResponse> response = studentPortalService.getAssignedTests(loginId, userId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Endpoint to view specific test details.
     */
    @GetMapping("/tests/{testId}")
    public ResponseEntity<?> getTestDetails(@PathVariable Long testId) {
        try {
            String loginId = resolveLoginId();
            Long userId = resolveUserId();
            StudentTestDetailResponse response = studentPortalService.getTestDetails(testId, loginId, userId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Endpoint to view test results list.
     */
    @GetMapping("/results")
    public ResponseEntity<?> getResults() {
        try {
            String loginId = resolveLoginId();
            Long userId = resolveUserId();
            List<StudentResultResponse> response = studentPortalService.getResults(loginId, userId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Endpoint to view specific result details.
     */
    @GetMapping("/results/{testId}")
    public ResponseEntity<?> getResultDetails(@PathVariable Long testId) {
        try {
            String loginId = resolveLoginId();
            Long userId = resolveUserId();
            StudentResultDetailResponse response = studentPortalService.getResultDetails(testId, loginId, userId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Utility method to resolve the student's username/login ID.
     */
    private String resolveLoginId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal().toString())) {
            return auth.getName();
        }
        return null;
    }

    /**
     * Utility method to resolve the student's user ID.
     */
    private Long resolveUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) auth.getPrincipal()).getUserId();
        }
        return null;
    }
}
