package com.broviders.bsat.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

/**
 * Data Transfer Object representing detailed test details for the start screen.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StudentTestDetailResponse {
    private Long testId;
    private String testName;
    private String subject;
    private Integer duration;
    private Integer totalQuestions;
    private Integer totalMarks;
    private String instructions;
    private String status; // "ASSIGNED" or "COMPLETED"
}
