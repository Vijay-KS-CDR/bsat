package com.broviders.bsat.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class EvaluationResultResponse {
    private Long id;
    private Long attemptId;
    private Long studentId;
    private String studentName;
    private Long testId;
    private String testName;
    private String subjectName;
    private Double totalMarks;
    private Double obtainedMarks;
    private Double percentage;
    private Integer correctAnswers;
    private Integer wrongAnswers;
    private String status;
    private LocalDateTime evaluatedAt;
    private java.util.Map<String, String> subjectBreakdown;
}
