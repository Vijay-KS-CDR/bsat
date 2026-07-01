package com.broviders.bsat.controller;

import com.broviders.bsat.dto.AnswerReviewResponse;
import com.broviders.bsat.dto.QuestionReviewResponse;
import com.broviders.bsat.service.ResultReviewService;
import com.broviders.bsat.exception.AccessDeniedException;
import com.broviders.bsat.exception.ResourceNotFoundException;
import com.broviders.bsat.security.CustomUserDetails;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ResultReviewController.class)
@AutoConfigureMockMvc(addFilters = false)
class ResultReviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ResultReviewService resultReviewService;

    @Autowired
    private ObjectMapper objectMapper;

    private AnswerReviewResponse mockResponse;

    @BeforeEach
    void setUp() {
        QuestionReviewResponse q1 = QuestionReviewResponse.builder()
                .questionId(1L)
                .questionNumber(1)
                .questionText("2 + 2 = ?")
                .questionType("MCQ")
                .studentAnswer("B")
                .correctAnswer("B")
                .marksAwarded(1.0)
                .status("CORRECT")
                .build();

        mockResponse = AnswerReviewResponse.builder()
                .attemptId(1L)
                .testName("Mathematics Unit Test")
                .subject("Mathematics")
                .totalMarks(100)
                .obtainedMarks(85)
                .percentage(85)
                .correctAnswers(42)
                .wrongAnswers(8)
                .submittedAt(LocalDateTime.of(2026, 6, 29, 10, 30, 0))
                .questions(Collections.singletonList(q1))
                .build();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    private void mockAuthentication(Long userId, String loginId, String roleName) {
        com.broviders.bsat.entity.Role role = new com.broviders.bsat.entity.Role();
        role.setName(roleName);
        
        com.broviders.bsat.entity.User user = com.broviders.bsat.entity.User.builder()
                .id(userId)
                .loginId(loginId)
                .role(role)
                .name("Test User")
                .build();
                
        CustomUserDetails userDetails = new CustomUserDetails(user);
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    void getAnswerReview_Success() throws Exception {
        mockAuthentication(2L, "student@gmail.com", "ROLE_STUDENT");
        when(resultReviewService.getAnswerReview(eq(1L), eq(2L))).thenReturn(mockResponse);

        mockMvc.perform(get("/api/results/review/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.attemptId").value(1))
                .andExpect(jsonPath("$.data.testName").value("Mathematics Unit Test"))
                .andExpect(jsonPath("$.data.questions[0].status").value("CORRECT"));
    }

    @Test
    void getAnswerReview_NotFound() throws Exception {
        mockAuthentication(2L, "student@gmail.com", "ROLE_STUDENT");
        when(resultReviewService.getAnswerReview(eq(1L), any()))
                .thenThrow(new ResourceNotFoundException("Test attempt not found with ID: 1"));

        mockMvc.perform(get("/api/results/review/1"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Test attempt not found with ID: 1"));
    }

    @Test
    void getAnswerReview_AccessDenied() throws Exception {
        mockAuthentication(3L, "student2@gmail.com", "ROLE_STUDENT");
        when(resultReviewService.getAnswerReview(eq(1L), eq(3L)))
                .thenThrow(new AccessDeniedException("Access Denied: You cannot view another student's exam review."));

        mockMvc.perform(get("/api/results/review/1"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Access Denied: You cannot view another student's exam review."));
    }

    @Test
    void getAnswerReview_BadRequest() throws Exception {
        mockAuthentication(2L, "student@gmail.com", "ROLE_STUDENT");
        when(resultReviewService.getAnswerReview(eq(1L), eq(2L)))
                .thenThrow(new IllegalArgumentException("Review is available only for completed attempts."));

        mockMvc.perform(get("/api/results/review/1"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Review is available only for completed attempts."));
    }
}
