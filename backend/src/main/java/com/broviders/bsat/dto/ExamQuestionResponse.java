package com.broviders.bsat.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

/**
 * DTO representing question data returned to the student during the exam.
 * Note that correctAnswer is excluded for security reasons.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ExamQuestionResponse {
    private Long id;
    private String questionType;
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private Integer marks;
    /** Subject name for section-based grouping in the exam screen UI. */
    private String subjectName;
}

