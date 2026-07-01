package com.broviders.bsat.dto;

import com.broviders.bsat.entity.QuestionType;
import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * DTO representing an inline question request inside Test Creation/Update.
 */
@Data
public class TestQuestionRequest {

    @NotNull(message = "Question type is required")
    private QuestionType questionType;

    @NotBlank(message = "Question text is required")
    @Size(min = 2, max = 5000, message = "Question text must be between 2 and 5000 characters")
    private String questionText;

    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String correctAnswer;

    @NotNull(message = "Marks is required")
    @Min(value = 1, message = "Marks must be at least 1")
    @Max(value = 100, message = "Marks must not exceed 100")
    private Integer marks;

    private Long subjectId;
}
