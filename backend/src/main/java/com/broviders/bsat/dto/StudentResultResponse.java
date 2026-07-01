package com.broviders.bsat.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

/**
 * Data Transfer Object representing a summary of a completed test's score.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StudentResultResponse {
    private Long testId;
    private String testName;
    private String subject;
    private Integer marksObtained;
    private Integer totalMarks;
    private Integer percentage;
}
