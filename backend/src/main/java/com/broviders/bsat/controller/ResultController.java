package com.broviders.bsat.controller;

import com.broviders.bsat.dto.EvaluationResultResponse;
import com.broviders.bsat.service.EvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {

    private final EvaluationService evaluationService;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<EvaluationResultResponse>> getResultsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(evaluationService.getResultsByStudent(studentId));
    }

    @GetMapping("/test/{testId}")
    public ResponseEntity<List<EvaluationResultResponse>> getResultsByTest(@PathVariable Long testId) {
        return ResponseEntity.ok(evaluationService.getResultsByTest(testId));
    }
}
