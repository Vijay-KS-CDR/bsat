package com.broviders.bsat.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

/**
 * Data Transfer Object representing a request to update an existing Test.
 * Only DRAFT tests may be updated.
 */
@Data
public class UpdateTestRequest {

    @NotBlank(message = "Test name is required")
    @Size(min = 3, max = 150, message = "Test name must be between 3 and 150 characters")
    private String testName;

    @NotBlank(message = "Class name is required")
    private String className;

    private String section;

    @NotNull(message = "Duration in minutes is required")
    @Min(value = 1, message = "Duration must be greater than 0")
    private Integer durationMinutes;

    private String instructions;

    @NotEmpty(message = "At least one question is required")
    @Valid
    private List<TestQuestionRequest> questions;
}
