package com.broviders.bsat.controller;

import com.broviders.bsat.dto.AuthResponse;
import com.broviders.bsat.dto.LoginRequest;
import com.broviders.bsat.dto.RegisterRequest;
import com.broviders.bsat.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Web layer unit tests for AuthController.
 * Uses MockMvc to perform mock HTTP POST requests and verify responses.
 */
@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false) // Bypasses security filters for simple testing
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Test user registration returns 200 OK and expected JSON body.
     */
    @Test
    void register_Success() throws Exception {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setName("Vijay");
        request.setLoginId("vijay@gmail.com");
        request.setPassword("Password@123");
        request.setRole("STUDENT");

        AuthResponse response = new AuthResponse("User registered successfully", "vijay@gmail.com", "STUDENT", "Vijay");
        when(authService.register(any(RegisterRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully"))
                .andExpect(jsonPath("$.loginId").value("vijay@gmail.com"))
                .andExpect(jsonPath("$.role").value("STUDENT"))
                .andExpect(jsonPath("$.name").value("Vijay"));
    }

    /**
     * Test user registration failures like login ID uniqueness throwing Exception.
     */
    @Test
    void register_Failure_LoginIdExists() throws Exception {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setName("Vijay");
        request.setLoginId("vijay@gmail.com");
        request.setPassword("Password@123");
        request.setRole("STUDENT");

        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new IllegalArgumentException("Login ID is already registered!"));

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Login ID is already registered!"));
    }

    /**
     * Test successful login returns 200 OK and credentials.
     */
    @Test
    void login_Success() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setLoginId("vijay@gmail.com");
        request.setPassword("Password@123");

        AuthResponse response = AuthResponse.builder()
                .success(true)
                .message("Login successful")
                .userId(1L)
                .name("Vijay")
                .role("STUDENT")
                .build();
        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.name").value("Vijay"))
                .andExpect(jsonPath("$.role").value("STUDENT"))
                .andExpect(jsonPath("$.loginId").doesNotExist());
    }
}
