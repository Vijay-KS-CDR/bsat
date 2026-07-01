package com.broviders.bsat.controller;

import com.broviders.bsat.dto.*;
import com.broviders.bsat.entity.*;
import com.broviders.bsat.repository.*;
import com.broviders.bsat.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controller exposing endpoints for Online Examination (Module 8).
 */
@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ExamController {

    private final TestRepository testRepository;
    private final TestQuestionRepository testQuestionRepository;
    private final com.broviders.bsat.service.EvaluationService evaluationService;
    private final StudentRepository studentRepository;
    private final TestAttemptRepository testAttemptRepository;

    @PostMapping("/start/{testId}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> startExam(
            @PathVariable Long testId) {
        try {
            Long resolvedUserId = resolveUserId();
            if (resolvedUserId == null) {
                return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "User is not authenticated"));
            }
            
            final Long finalUserId = resolvedUserId;
            Student student = studentRepository.findByUserId(finalUserId)
                    .orElseThrow(() -> new IllegalArgumentException("Student not found with associated user ID: " + finalUserId));

            // Prevent starting if already completed
            java.util.Optional<TestAttempt> existingAttempt = testAttemptRepository
                    .findFirstByStudentIdAndTestIdAndStatus(student.getId(), testId, "SUBMITTED");
            if (existingAttempt.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "You have already completed this exam."));
            }

            Test test = testRepository.findById(testId)
                    .orElseThrow(() -> new IllegalArgumentException("Test not found with ID: " + testId));

            List<TestQuestion> testQuestions = testQuestionRepository.findByTestId(testId);
            List<ExamQuestionResponse> questions = testQuestions.stream()
                    .map(tq -> {
                        Question q = tq.getQuestion();
                        return ExamQuestionResponse.builder()
                                .id(q.getId())
                                .questionType(q.getQuestionType() != null ? q.getQuestionType().name() : "MCQ_SINGLE")
                                .questionText(q.getQuestionText())
                                .optionA(q.getOptionA())
                                .optionB(q.getOptionB())
                                .optionC(q.getOptionC())
                                .optionD(q.getOptionD())
                                .marks(q.getMarks())
                                .subjectName(q.getSubject() != null ? q.getSubject().getSubjectName() : null)
                                .build();
                    })
                    .collect(Collectors.toList());

            ExamStartResponse response = ExamStartResponse.builder()
                    .testId(test.getId())
                    .testName(test.getTestName())
                    .subjectName(test.getSubject() != null ? test.getSubject().getSubjectName() : "General")
                    .durationMinutes(test.getDurationMinutes())
                    .totalQuestions(test.getTotalQuestions())
                    .totalMarks(test.getTotalMarks())
                    .instructions(test.getInstructions())
                    .questions(questions)
                    .build();

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/save-answer")
    public ResponseEntity<?> saveAnswer(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(Map.of("success", true, "message", "Answer saved locally"));
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitExam(
            @RequestBody Map<String, Object> payload) {
        try {
            Long resolvedUserId = resolveUserId();
            if (resolvedUserId == null) {
                return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "User is not authenticated"));
            }
            Long testId = Long.valueOf(payload.get("testId").toString());
            Map<String, String> answers = (Map<String, String>) payload.get("answers");
            
            EvaluationResultResponse result = evaluationService.submitAttempt(testId, resolvedUserId, answers);
            return ResponseEntity.ok(Map.of("success", true, "message", "Exam evaluated and submitted successfully", "result", result));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
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

    @PostMapping("/violation")
    public ResponseEntity<?> logViolation(@RequestBody Map<String, Object> payload) {
        System.out.println("SECURITY VIOLATION LOGGED: " + payload);
        return ResponseEntity.ok(Map.of("success", true, "message", "Violation logged successfully"));
    }

    @PostMapping("/event")
    public ResponseEntity<?> logEvent(@RequestBody Map<String, Object> payload) {
        System.out.println("AUDIT EVENT LOGGED: " + payload);
        return ResponseEntity.ok(Map.of("success", true, "message", "Event logged successfully"));
    }
}
