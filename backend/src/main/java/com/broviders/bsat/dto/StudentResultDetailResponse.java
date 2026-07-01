package com.broviders.bsat.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

/**
 * Data Transfer Object representing detailed correct/wrong answers stats of a completed test.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StudentResultDetailResponse {
    private Long attemptId;
    private String testName;
    private Integer marksObtained;
    private Integer totalMarks;
    private Integer percentage;
    private Integer correctAnswers;
    private Integer wrongAnswers;
    private java.util.Map<String, String> subjectBreakdown;
}
