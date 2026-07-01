package com.broviders.bsat.dto;

import com.broviders.bsat.entity.TestStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Data Transfer Object representing full details of an Assessment Test,
 * including the inline question list.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TestResponse {
    private Long id;
    private String testName;
    private String className;
    private String section;
    private String instructions;
    private Long subjectId;
    private String subjectName;
    private Integer durationMinutes;
    private Integer totalMarks;
    private Integer totalQuestions;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private TestStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<QuestionResponse> questions;
}
