package com.broviders.bsat.dto;

import com.broviders.bsat.entity.Difficulty;
import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * DTO representing a request to update an existing Question.
 */
@Data
public class UpdateQuestionRequest {

    @Size(min = 3, max = 100, message = "Topic must be between 3 and 100 characters")
    private String topic;

    private Difficulty difficulty;

    @Min(value = 1, message = "Marks must be at least 1")
    @Max(value = 100, message = "Marks must not exceed 100")
    private Integer marks;

    private String status;
}
