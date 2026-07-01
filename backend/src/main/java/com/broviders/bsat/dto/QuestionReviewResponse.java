package com.broviders.bsat.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import java.util.List;

/**
 * DTO representing an individual question's review inside an attempt.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class QuestionReviewResponse {
    private Long questionId;
    private Integer questionNumber;
    private String questionText;
    private String questionType;
    private String studentAnswer;
    private String correctAnswer;
    private Double marksAwarded;
    private String status; // CORRECT, WRONG, SKIPPED
    private List<String> options; // Optional MCQ options to support frontend rendering
}
