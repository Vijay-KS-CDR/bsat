package com.broviders.bsat.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

/**
 * Data Transfer Object representing the student dashboard summary.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StudentDashboardResponse {
    private String studentName;
    private String className;
    private String section;
    private Integer assignedTests;
    private Integer completedTests;
}
