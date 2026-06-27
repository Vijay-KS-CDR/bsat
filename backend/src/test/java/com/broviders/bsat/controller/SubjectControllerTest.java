package com.broviders.bsat.controller;

import com.broviders.bsat.dto.*;
import com.broviders.bsat.service.SubjectService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SubjectController.class)
@AutoConfigureMockMvc(addFilters = false)
class SubjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SubjectService subjectService;

    @Autowired
    private ObjectMapper objectMapper;

    private SubjectResponse subjectResponse;

    @BeforeEach
    void setUp() {
        subjectResponse = SubjectResponse.builder()
                .id(1L)
                .subjectCode("MAT101")
                .subjectName("Mathematics")
                .description("Algebra and Calculus basics.")
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void createSubject_Success() throws Exception {
        CreateSubjectRequest request = new CreateSubjectRequest();
        request.setSubjectCode("MAT101");
        request.setSubjectName("Mathematics");
        request.setDescription("Algebra and Calculus basics.");
        request.setStatus("ACTIVE");

        when(subjectService.createSubject(any(CreateSubjectRequest.class))).thenReturn(subjectResponse);

        mockMvc.perform(post("/api/subjects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.subjectCode").value("MAT101"))
                .andExpect(jsonPath("$.subjectName").value("Mathematics"))
                .andExpect(jsonPath("$.status").value("ACTIVE"));
    }

    @Test
    void getSubjectById_Success() throws Exception {
        when(subjectService.getSubjectById(1L)).thenReturn(subjectResponse);

        mockMvc.perform(get("/api/subjects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.subjectCode").value("MAT101"))
                .andExpect(jsonPath("$.subjectName").value("Mathematics"));
    }

    @Test
    void getSubjectById_NotFound() throws Exception {
        when(subjectService.getSubjectById(99L)).thenThrow(new IllegalArgumentException("Subject not found"));

        mockMvc.perform(get("/api/subjects/99"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Subject not found"));
    }

    @Test
    void getAllSubjects_Success() throws Exception {
        when(subjectService.getAllSubjects()).thenReturn(Arrays.asList(subjectResponse));

        mockMvc.perform(get("/api/subjects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.subjects[0].id").value(1))
                .andExpect(jsonPath("$.subjects[0].subjectName").value("Mathematics"));
    }

    @Test
    void updateSubject_Success() throws Exception {
        UpdateSubjectRequest request = new UpdateSubjectRequest();
        request.setSubjectName("Mathematics Updated");
        request.setDescription("Algebra and Calculus basics updated.");
        request.setStatus("INACTIVE");

        subjectResponse.setSubjectName("Mathematics Updated");
        subjectResponse.setDescription("Algebra and Calculus basics updated.");
        subjectResponse.setStatus("INACTIVE");

        when(subjectService.updateSubject(eq(1L), any(UpdateSubjectRequest.class))).thenReturn(subjectResponse);

        mockMvc.perform(put("/api/subjects/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.subjectName").value("Mathematics Updated"))
                .andExpect(jsonPath("$.description").value("Algebra and Calculus basics updated."))
                .andExpect(jsonPath("$.status").value("INACTIVE"));
    }

    @Test
    void deleteSubject_Success() throws Exception {
        doNothing().when(subjectService).deleteSubject(1L);

        mockMvc.perform(delete("/api/subjects/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Subject deleted successfully"));
    }

    @Test
    void updateSubjectStatus_Success() throws Exception {
        subjectResponse.setStatus("INACTIVE");
        when(subjectService.updateSubjectStatus(eq(1L), eq("INACTIVE"))).thenReturn(subjectResponse);

        Map<String, String> body = new HashMap<>();
        body.put("status", "INACTIVE");

        mockMvc.perform(patch("/api/subjects/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("INACTIVE"));
    }
}
