package com.broviders.bsat.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import java.util.List;

/**
 * DTO returned to the student when they start an online examination.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ExamStartResponse {
    private Long testId;
    private String testName;
    private String subjectName;
    private Integer durationMinutes;
    private Integer totalQuestions;
    private Integer totalMarks;
    private String instructions;
    private List<ExamQuestionResponse> questions;
}
