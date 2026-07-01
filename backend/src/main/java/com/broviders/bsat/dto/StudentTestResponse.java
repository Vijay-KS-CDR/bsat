package com.broviders.bsat.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

/**
 * Data Transfer Object representing a brief test info block in the My Tests list.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StudentTestResponse {
    private Long testId;
    private String testName;
    private String subject;
    private Integer duration;
    private String status; // "ASSIGNED", "COMPLETED"
}
