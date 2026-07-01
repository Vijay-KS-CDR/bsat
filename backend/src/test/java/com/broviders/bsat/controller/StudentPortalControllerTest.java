package com.broviders.bsat.controller;

import com.broviders.bsat.dto.*;
import com.broviders.bsat.service.StudentPortalService;
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
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(StudentPortalController.class)
@AutoConfigureMockMvc(addFilters = false)
class StudentPortalControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudentPortalService studentPortalService;

    @Autowired
    private ObjectMapper objectMapper;

    private StudentDashboardResponse dashboardResponse;
    private StudentTestResponse testResponse;
    private StudentTestDetailResponse testDetailResponse;
    private StudentResultResponse resultResponse;
    private StudentResultDetailResponse resultDetailResponse;

    @BeforeEach
    void setUp() {
        dashboardResponse = StudentDashboardResponse.builder()
                .studentName("Vijay")
                .className("8")
                .section("A")
                .assignedTests(5)
                .completedTests(3)
                .build();

        testResponse = StudentTestResponse.builder()
                .testId(1L)
                .testName("Mathematics Unit Test")
                .subject("Mathematics")
                .duration(60)
                .status("ASSIGNED")
                .build();

        testDetailResponse = StudentTestDetailResponse.builder()
                .testId(1L)
                .testName("Mathematics Unit Test")
                .subject("Mathematics")
                .duration(60)
                .totalQuestions(50)
                .totalMarks(100)
                .instructions("Answer all questions.")
                .build();

        resultResponse = StudentResultResponse.builder()
                .testId(1L)
                .testName("Mathematics Unit Test")
                .marksObtained(85)
                .totalMarks(100)
                .percentage(85)
                .build();

        resultDetailResponse = StudentResultDetailResponse.builder()
                .testName("Mathematics Unit Test")
                .marksObtained(85)
                .totalMarks(100)
                .percentage(85)
                .correctAnswers(42)
                .wrongAnswers(8)
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
                .name("Test Student")
                .build();
                
        CustomUserDetails userDetails = new CustomUserDetails(user);
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    void getDashboard_Success() throws Exception {
        mockAuthentication(2L, "STU-8A-042", "ROLE_STUDENT");
        when(studentPortalService.getDashboard(eq("STU-8A-042"), eq(2L))).thenReturn(dashboardResponse);

        mockMvc.perform(get("/api/student/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.studentName").value("Vijay"))
                .andExpect(jsonPath("$.className").value("8"))
                .andExpect(jsonPath("$.section").value("A"))
                .andExpect(jsonPath("$.assignedTests").value(5))
                .andExpect(jsonPath("$.completedTests").value(3));
    }

    @Test
    void getAssignedTests_Success() throws Exception {
        mockAuthentication(2L, "STU-8A-042", "ROLE_STUDENT");
        when(studentPortalService.getAssignedTests(eq("STU-8A-042"), eq(2L))).thenReturn(Arrays.asList(testResponse));

        mockMvc.perform(get("/api/student/tests"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].testId").value(1))
                .andExpect(jsonPath("$[0].testName").value("Mathematics Unit Test"))
                .andExpect(jsonPath("$[0].status").value("ASSIGNED"));
    }

    @Test
    void getTestDetails_Success() throws Exception {
        mockAuthentication(2L, "STU-8A-042", "ROLE_STUDENT");
        when(studentPortalService.getTestDetails(eq(1L), eq("STU-8A-042"), eq(2L))).thenReturn(testDetailResponse);

        mockMvc.perform(get("/api/student/tests/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.testId").value(1))
                .andExpect(jsonPath("$.testName").value("Mathematics Unit Test"))
                .andExpect(jsonPath("$.instructions").value("Answer all questions."));
    }

    @Test
    void getResults_Success() throws Exception {
        mockAuthentication(2L, "STU-8A-042", "ROLE_STUDENT");
        when(studentPortalService.getResults(eq("STU-8A-042"), eq(2L))).thenReturn(Arrays.asList(resultResponse));

        mockMvc.perform(get("/api/student/results"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].testId").value(1))
                .andExpect(jsonPath("$[0].percentage").value(85));
    }

    @Test
    void getResultDetails_Success() throws Exception {
        mockAuthentication(2L, "STU-8A-042", "ROLE_STUDENT");
        when(studentPortalService.getResultDetails(eq(1L), eq("STU-8A-042"), eq(2L))).thenReturn(resultDetailResponse);

        mockMvc.perform(get("/api/student/results/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.testName").value("Mathematics Unit Test"))
                .andExpect(jsonPath("$.percentage").value(85))
                .andExpect(jsonPath("$.correctAnswers").value(42));
    }
}
