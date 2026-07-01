package com.broviders.bsat.dto;

import com.broviders.bsat.entity.QuestionType;
import com.broviders.bsat.entity.Difficulty;
import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * DTO representing a request to create a new Question.
 */
@Data
public class CreateQuestionRequest {

    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    @NotBlank(message = "Topic is required")
    @Size(min = 3, max = 100, message = "Topic must be between 3 and 100 characters")
    private String topic;

    @NotNull(message = "Question type is required")
    private QuestionType questionType;

    @NotNull(message = "Difficulty is required")
    private Difficulty difficulty;

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

    private String status = "ACTIVE";
}
