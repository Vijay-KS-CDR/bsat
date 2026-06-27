package com.broviders.bsat.dto;

import com.broviders.bsat.entity.QuestionType;
import com.broviders.bsat.entity.Difficulty;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

/**
 * DTO representing output payload for Question queries.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class QuestionResponse {
    private Long id;
    private Long subjectId;
    private String subjectName;
    private String topic;
    private QuestionType questionType;
    private Difficulty difficulty;
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String correctAnswer;
    private Integer marks;
    private String status;
}
