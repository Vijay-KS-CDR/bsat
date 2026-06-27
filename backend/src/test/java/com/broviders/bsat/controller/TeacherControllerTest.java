package com.broviders.bsat.controller;

import com.broviders.bsat.dto.*;
import com.broviders.bsat.service.TeacherService;
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

@WebMvcTest(TeacherController.class)
@AutoConfigureMockMvc(addFilters = false)
class TeacherControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TeacherService teacherService;

    @Autowired
    private ObjectMapper objectMapper;

    private TeacherResponse teacherResponse;

    @BeforeEach
    void setUp() {
        teacherResponse = TeacherResponse.builder()
                .id(1L)
                .userId(10L)
                .name("Arun Kumar")
                .loginId("TCH001")
                .role("TEACHER")
                .employeeId("TCH001")
                .phone("9876543210")
                .qualification("M.Sc Mathematics")
                .experience(5)
                .address("Chennai")
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void createTeacher_Success() throws Exception {
        CreateTeacherRequest request = new CreateTeacherRequest();
        request.setName("Arun Kumar");
        request.setEmployeeId("TCH001");
        request.setLoginId("TCH001");
        request.setPassword("Temp@123");
        request.setPhone("9876543210");
        request.setQualification("M.Sc Mathematics");
        request.setExperience(5);
        request.setAddress("Chennai");
        request.setStatus("ACTIVE");

        when(teacherService.createTeacher(any(CreateTeacherRequest.class))).thenReturn(teacherResponse);

        mockMvc.perform(post("/api/teachers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Arun Kumar"))
                .andExpect(jsonPath("$.employeeId").value("TCH001"))
                .andExpect(jsonPath("$.status").value("ACTIVE"));
    }

    @Test
    void getTeacherById_Success() throws Exception {
        when(teacherService.getTeacherById(1L)).thenReturn(teacherResponse);

        mockMvc.perform(get("/api/teachers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Arun Kumar"))
                .andExpect(jsonPath("$.employeeId").value("TCH001"));
    }

    @Test
    void getTeacherById_NotFound() throws Exception {
        when(teacherService.getTeacherById(99L)).thenThrow(new IllegalArgumentException("Teacher not found"));

        mockMvc.perform(get("/api/teachers/99"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Teacher not found"));
    }

    @Test
    void getAllTeachers_Success() throws Exception {
        when(teacherService.getAllTeachers()).thenReturn(Arrays.asList(teacherResponse));

        mockMvc.perform(get("/api/teachers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.teachers[0].id").value(1))
                .andExpect(jsonPath("$.teachers[0].name").value("Arun Kumar"));
    }

    @Test
    void updateTeacher_Success() throws Exception {
        UpdateTeacherRequest request = new UpdateTeacherRequest();
        request.setName("Arun Kumar Updated");
        request.setPhone("9876543210");
        request.setQualification("Ph.D Mathematics");
        request.setExperience(6);
        request.setAddress("Chennai Updated");
        request.setStatus("INACTIVE");

        teacherResponse.setName("Arun Kumar Updated");
        teacherResponse.setQualification("Ph.D Mathematics");
        teacherResponse.setExperience(6);
        teacherResponse.setAddress("Chennai Updated");
        teacherResponse.setStatus("INACTIVE");

        when(teacherService.updateTeacher(eq(1L), any(UpdateTeacherRequest.class))).thenReturn(teacherResponse);

        mockMvc.perform(put("/api/teachers/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Arun Kumar Updated"))
                .andExpect(jsonPath("$.qualification").value("Ph.D Mathematics"))
                .andExpect(jsonPath("$.status").value("INACTIVE"));
    }

    @Test
    void deleteTeacher_Success() throws Exception {
        doNothing().when(teacherService).deleteTeacher(1L);

        mockMvc.perform(delete("/api/teachers/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Teacher deleted successfully"));
    }

    @Test
    void updateTeacherStatus_Success() throws Exception {
        teacherResponse.setStatus("INACTIVE");
        when(teacherService.updateTeacherStatus(eq(1L), eq("INACTIVE"))).thenReturn(teacherResponse);

        Map<String, String> body = new HashMap<>();
        body.put("status", "INACTIVE");

        mockMvc.perform(patch("/api/teachers/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("INACTIVE"));
    }
}
