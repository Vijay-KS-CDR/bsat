package com.broviders.bsat.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO representing the response for a completed test's detailed question-by-question review.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AnswerReviewResponse {
    private Long attemptId;
    private String testName;
    private String subject;
    private Integer totalMarks;
    private Integer obtainedMarks;
    private Integer percentage;
    private Integer correctAnswers;
    private Integer wrongAnswers;
    private LocalDateTime submittedAt;
    private List<QuestionReviewResponse> questions;
}
