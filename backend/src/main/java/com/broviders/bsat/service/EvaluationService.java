package com.broviders.bsat.service;

import com.broviders.bsat.dto.*;
import java.util.List;
import java.util.Map;

public interface EvaluationService {
    EvaluationResultResponse submitAttempt(Long testId, Long userId, Map<String, String> answers);
    List<StudentAnswerResponse> getEvaluationsByTest(Long testId);
    List<StudentAnswerResponse> getEvaluationsByAttempt(Long attemptId);
    List<EvaluationResultResponse> getResultsByStudent(Long studentId);
    List<EvaluationResultResponse> getResultsByTest(Long testId);
}
