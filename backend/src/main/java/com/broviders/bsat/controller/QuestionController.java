package com.broviders.bsat.controller;

import com.broviders.bsat.dto.*;
import com.broviders.bsat.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * REST Controller exposing endpoints for Question Bank CRUD operations.
 */
@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<?> createQuestion(@Valid @RequestBody CreateQuestionRequest request) {
        try {
            QuestionResponse created = questionService.createQuestion(request);
            return new ResponseEntity<>(ApiResponse.<QuestionResponse>builder()
                    .success(true)
                    .message("Question created successfully")
                    .data(created)
                    .build(), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .build());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getQuestionById(@PathVariable Long id) {
        try {
            QuestionResponse question = questionService.getQuestionById(id);
            return ResponseEntity.ok(ApiResponse.<QuestionResponse>builder()
                    .success(true)
                    .message("Question fetched successfully")
                    .data(question)
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .build());
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<QuestionResponse>>> getAllQuestions() {
        List<QuestionResponse> questions = questionService.getAllQuestions();
        return ResponseEntity.ok(ApiResponse.<List<QuestionResponse>>builder()
                .success(true)
                .message("Questions fetched successfully")
                .data(questions)
                .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuestion(@PathVariable Long id, @Valid @RequestBody UpdateQuestionRequest request) {
        try {
            QuestionResponse updated = questionService.updateQuestion(id, request);
            return ResponseEntity.ok(ApiResponse.<QuestionResponse>builder()
                    .success(true)
                    .message("Question updated successfully")
                    .data(updated)
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .build());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        try {
            questionService.deleteQuestion(id);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("Question deleted successfully")
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .build());
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateQuestionStatus(@PathVariable Long id, @RequestBody Map<String, String> requestBody) {
        try {
            String status = requestBody.get("status");
            if (status == null) {
                throw new IllegalArgumentException("Status value is required");
            }
            QuestionResponse updated = questionService.updateQuestionStatus(id, status);
            return ResponseEntity.ok(ApiResponse.<QuestionResponse>builder()
                    .success(true)
                    .message("Question status updated")
                    .data(updated)
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .build());
        }
    }
}
