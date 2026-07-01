package com.broviders.bsat.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentAnswerResponse {
    private Long id;
    private Long attemptId;
    private Long questionId;
    private String questionText;
    private String questionType;
    private String studentName;
    private String testName;
    private String studentAnswer;
    private String correctAnswer;
    private Integer maxMarks;
    private Double marksAwarded;
    private Boolean isCorrect;
    private String remarks;
    private String status;
}
