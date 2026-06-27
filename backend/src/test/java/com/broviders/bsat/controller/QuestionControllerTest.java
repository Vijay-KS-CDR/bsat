package com.broviders.bsat.controller;

import com.broviders.bsat.dto.*;
import com.broviders.bsat.entity.QuestionType;
import com.broviders.bsat.entity.Difficulty;
import com.broviders.bsat.service.QuestionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(QuestionController.class)
@AutoConfigureMockMvc(addFilters = false)
class QuestionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private QuestionService questionService;

    @Autowired
    private ObjectMapper objectMapper;

    private QuestionResponse questionResponse;

    @BeforeEach
    void setUp() {
        questionResponse = QuestionResponse.builder()
                .id(1L)
                .subjectId(10L)
                .subjectName("Mathematics")
                .topic("Algebra")
                .questionType(QuestionType.MCQ)
                .difficulty(Difficulty.EASY)
                .questionText("What is 2 + 2?")
                .optionA("1")
                .optionB("2")
                .optionC("3")
                .optionD("4")
                .correctAnswer("D")
                .marks(1)
                .status("ACTIVE")
                .build();
    }

    @Test
    void createQuestion_Success() throws Exception {
        CreateQuestionRequest request = new CreateQuestionRequest();
        request.setSubjectId(10L);
        request.setTopic("Algebra");
        request.setQuestionType(QuestionType.MCQ);
        request.setDifficulty(Difficulty.EASY);
        request.setQuestionText("What is 2 + 2?");
        request.setOptionA("1");
        request.setOptionB("2");
        request.setOptionC("3");
        request.setOptionD("4");
        request.setCorrectAnswer("D");
        request.setMarks(1);
        request.setStatus("ACTIVE");

        when(questionService.createQuestion(any(CreateQuestionRequest.class))).thenReturn(questionResponse);

        mockMvc.perform(post("/api/questions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Question created successfully"));
    }

    @Test
    void getQuestionById_Success() throws Exception {
        when(questionService.getQuestionById(1L)).thenReturn(questionResponse);

        mockMvc.perform(get("/api/questions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.questionText").value("What is 2 + 2?"))
                .andExpect(jsonPath("$.data.correctAnswer").value("D"));
    }

    @Test
    void getQuestionById_NotFound() throws Exception {
        when(questionService.getQuestionById(99L)).thenThrow(new IllegalArgumentException("Question not found"));

        mockMvc.perform(get("/api/questions/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Question not found"));
    }

    @Test
    void getAllQuestions_Success() throws Exception {
        when(questionService.getAllQuestions()).thenReturn(Arrays.asList(questionResponse));

        mockMvc.perform(get("/api/questions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value(1))
                .andExpect(jsonPath("$.data[0].questionText").value("What is 2 + 2?"));
    }

    @Test
    void updateQuestion_Success() throws Exception {
        UpdateQuestionRequest request = new UpdateQuestionRequest();
        request.setTopic("Advanced Algebra");
        request.setDifficulty(Difficulty.MEDIUM);
        request.setMarks(2);

        questionResponse.setTopic("Advanced Algebra");
        questionResponse.setDifficulty(Difficulty.MEDIUM);
        questionResponse.setMarks(2);

        when(questionService.updateQuestion(eq(1L), any(UpdateQuestionRequest.class))).thenReturn(questionResponse);

        mockMvc.perform(put("/api/questions/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Question updated successfully"));
    }

    @Test
    void deleteQuestion_Success() throws Exception {
        doNothing().when(questionService).deleteQuestion(1L);

        mockMvc.perform(delete("/api/questions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Question deleted successfully"));
    }

    @Test
    void updateQuestionStatus_Success() throws Exception {
        questionResponse.setStatus("INACTIVE");
        when(questionService.updateQuestionStatus(eq(1L), eq("INACTIVE"))).thenReturn(questionResponse);

        Map<String, String> body = new HashMap<>();
        body.put("status", "INACTIVE");

        mockMvc.perform(patch("/api/questions/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Question status updated"));
    }
}
