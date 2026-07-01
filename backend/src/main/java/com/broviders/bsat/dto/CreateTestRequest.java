package com.broviders.bsat.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Data Transfer Object representing a request to create a new Test
 * with directly embedded inline questions.
 */
@Data
public class CreateTestRequest {

    @NotBlank(message = "Test name is required")
    @Size(min = 3, max = 150, message = "Test name must be between 3 and 150 characters")
    private String testName;

    @NotBlank(message = "Class name is required")
    private String className;

    private String section;

    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    @NotNull(message = "Duration in minutes is required")
    @Min(value = 1, message = "Duration must be greater than 0")
    private Integer durationMinutes;

    private String instructions;

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    private LocalDateTime endTime;

    @NotEmpty(message = "At least one question is required")
    @Valid
    private List<TestQuestionRequest> questions;
}
