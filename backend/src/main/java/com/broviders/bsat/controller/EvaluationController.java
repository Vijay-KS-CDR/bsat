package com.broviders.bsat.controller;

import com.broviders.bsat.dto.*;
import com.broviders.bsat.service.EvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Controller exposing REST endpoints for Student attempt evaluations.
 */
@RestController
@RequestMapping("/api/evaluations")
@RequiredArgsConstructor
public class EvaluationController {

    private final EvaluationService evaluationService;

    @GetMapping("/test/{testId}")
    public ResponseEntity<List<StudentAnswerResponse>> getEvaluationsByTest(@PathVariable Long testId) {
        return ResponseEntity.ok(evaluationService.getEvaluationsByTest(testId));
    }

    @GetMapping("/attempt/{attemptId}")
    public ResponseEntity<List<StudentAnswerResponse>> getEvaluationsByAttempt(@PathVariable Long attemptId) {
        return ResponseEntity.ok(evaluationService.getEvaluationsByAttempt(attemptId));
    }
}
