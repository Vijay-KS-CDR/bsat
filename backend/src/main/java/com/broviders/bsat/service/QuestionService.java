package com.broviders.bsat.service;

import com.broviders.bsat.dto.CreateQuestionRequest;
import com.broviders.bsat.dto.UpdateQuestionRequest;
import com.broviders.bsat.dto.QuestionResponse;
import java.util.List;

/**
 * Service interface defining Question Bank CRUD and status operations.
 */
public interface QuestionService {

    List<QuestionResponse> getAllQuestions();

    QuestionResponse getQuestionById(Long id);

    QuestionResponse createQuestion(CreateQuestionRequest request);

    QuestionResponse updateQuestion(Long id, UpdateQuestionRequest request);

    void deleteQuestion(Long id);

    QuestionResponse updateQuestionStatus(Long id, String status);
}
