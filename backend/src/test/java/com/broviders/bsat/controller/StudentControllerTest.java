package com.broviders.bsat.controller;

import com.broviders.bsat.dto.*;
import com.broviders.bsat.service.StudentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StudentController.class)
@AutoConfigureMockMvc(addFilters = false)
class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudentService studentService;

    @Autowired
    private ObjectMapper objectMapper;

    private StudentResponse studentResponse;

    @BeforeEach
    void setUp() {
        studentResponse = StudentResponse.builder()
                .id(1L)
                .userId(10L)
                .name("Vijay K S")
                .loginId("vijay711")
                .role("STUDENT")
                .admissionNumber("AGN240015")
                .className("Grade 10")
                .section("A")
                .gender("MALE")
                .dateOfBirth(LocalDate.of(2010, 5, 20))
                .parentName("Suresh")
                .parentPhone("9876543210")
                .address("123 Street Name")
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void createStudent_Success() throws Exception {
        CreateStudentRequest request = new CreateStudentRequest();
        request.setName("Vijay K S");
        request.setLoginId("vijay711");
        request.setPassword("Password@123");
        request.setAdmissionNumber("AGN240015");
        request.setClassName("Grade 10");
        request.setSection("A");
        request.setGender("MALE");
        request.setDateOfBirth(LocalDate.of(2010, 5, 20));
        request.setParentName("Suresh");
        request.setParentPhone("9876543210");
        request.setAddress("123 Street Name");
        request.setStatus("ACTIVE");

        when(studentService.createStudent(any(CreateStudentRequest.class))).thenReturn(studentResponse);

        mockMvc.perform(post("/api/students")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Vijay K S"))
                .andExpect(jsonPath("$.admissionNumber").value("AGN240015"))
                .andExpect(jsonPath("$.status").value("ACTIVE"));
    }

    @Test
    void getStudentById_Success() throws Exception {
        when(studentService.getStudentById(1L)).thenReturn(studentResponse);

        mockMvc.perform(get("/api/students/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Vijay K S"))
                .andExpect(jsonPath("$.admissionNumber").value("AGN240015"));
    }

    @Test
    void getStudentById_NotFound() throws Exception {
        when(studentService.getStudentById(99L)).thenThrow(new IllegalArgumentException("Student not found"));

        mockMvc.perform(get("/api/students/99"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Student not found"));
    }

    @Test
    void getAllStudents_Success() throws Exception {
        when(studentService.getAllStudents()).thenReturn(Arrays.asList(studentResponse));

        mockMvc.perform(get("/api/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.students[0].id").value(1))
                .andExpect(jsonPath("$.students[0].name").value("Vijay K S"));
    }

    @Test
    void updateStudent_Success() throws Exception {
        UpdateStudentRequest request = new UpdateStudentRequest();
        request.setName("Vijay K S Updated");
        request.setClassName("Grade 11");
        request.setSection("B");
        request.setGender("MALE");
        request.setDateOfBirth(LocalDate.of(2010, 5, 20));
        request.setParentName("Suresh");
        request.setParentPhone("9876543210");
        request.setAddress("123 Street Name");
        request.setStatus("INACTIVE");

        studentResponse.setName("Vijay K S Updated");
        studentResponse.setClassName("Grade 11");
        studentResponse.setSection("B");
        studentResponse.setStatus("INACTIVE");

        when(studentService.updateStudent(eq(1L), any(UpdateStudentRequest.class))).thenReturn(studentResponse);

        mockMvc.perform(put("/api/students/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Vijay K S Updated"))
                .andExpect(jsonPath("$.className").value("Grade 11"))
                .andExpect(jsonPath("$.status").value("INACTIVE"));
    }

    @Test
    void deleteStudent_Success() throws Exception {
        doNothing().when(studentService).deleteStudent(1L);

        mockMvc.perform(delete("/api/students/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Student deleted successfully"));
    }

    @Test
    void updateStudentStatus_Success() throws Exception {
        studentResponse.setStatus("INACTIVE");
        when(studentService.updateStudentStatus(eq(1L), eq("INACTIVE"))).thenReturn(studentResponse);

        Map<String, String> body = new HashMap<>();
        body.put("status", "INACTIVE");

        mockMvc.perform(patch("/api/students/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("INACTIVE"));
    }
}
