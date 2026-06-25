package com.broviders.bsat.service;

import com.broviders.bsat.dto.AuthResponse;
import com.broviders.bsat.dto.LoginRequest;
import com.broviders.bsat.dto.RegisterRequest;
import com.broviders.bsat.entity.Role;
import com.broviders.bsat.entity.User;
import com.broviders.bsat.repository.RoleRepository;
import com.broviders.bsat.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the AuthService class.
 * Uses Mockito to mock database dependencies so tests run quickly without requiring a PostgreSQL connection.
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private Role studentRole;
    private User studentUser;

    /**
     * Set up common entities before each test runs.
     */
    @BeforeEach
    void setUp() {
        studentRole = Role.builder()
                .id(1)
                .name("STUDENT")
                .build();

        studentUser = User.builder()
                .id(1L)
                .name("Vijay")
                .loginId("vijay@gmail.com")
                .password("hashedPassword123")
                .role(studentRole)
                .build();
    }

    /**
     * Test successful registration flow.
     */
    @Test
    void register_Success() {
        // Arrange (Setup request and mock behaviors)
        RegisterRequest request = new RegisterRequest();
        request.setName("Vijay");
        request.setLoginId("vijay@gmail.com");
        request.setPassword("Password@123");
        request.setRole("STUDENT");

        when(userRepository.existsByLoginId(request.getLoginId())).thenReturn(false);
        when(roleRepository.findByName("STUDENT")).thenReturn(Optional.of(studentRole));
        when(passwordEncoder.encode(request.getPassword())).thenReturn("hashedPassword123");
        when(userRepository.save(any(User.class))).thenReturn(studentUser);

        // Act (Execute the target method)
        AuthResponse response = authService.register(request);

        // Assert (Verify results and method invocations)
        assertNotNull(response);
        assertEquals("User registered successfully", response.getMessage());
        assertEquals("vijay@gmail.com", response.getLoginId());
        assertEquals("STUDENT", response.getRole());
        assertEquals("Vijay", response.getName());

        verify(userRepository).existsByLoginId(request.getLoginId());
        verify(roleRepository).findByName("STUDENT");
        verify(passwordEncoder).encode(request.getPassword());
        verify(userRepository).save(any(User.class));
    }

    /**
     * Test that registration fails if the login ID is already in use.
     */
    @Test
    void register_LoginIdAlreadyExists_ThrowsException() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setName("Vijay");
        request.setLoginId("vijay@gmail.com");
        request.setPassword("Password@123");
        request.setRole("STUDENT");

        when(userRepository.existsByLoginId(request.getLoginId())).thenReturn(true);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.register(request);
        });

        assertEquals("Login ID is already registered!", exception.getMessage());
        verify(userRepository).existsByLoginId(request.getLoginId());
        // Verify that database lookup for roles and saving does not occur when login ID exists
        verify(roleRepository, never()).findByName(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    /**
     * Test successful login flow.
     */
    @Test
    void login_Success() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setLoginId("vijay@gmail.com");
        request.setPassword("Password@123");

        when(userRepository.findByLoginId(request.getLoginId())).thenReturn(Optional.of(studentUser));
        when(passwordEncoder.matches(request.getPassword(), studentUser.getPassword())).thenReturn(true);

        // Act
        AuthResponse response = authService.login(request);

        // Assert
        assertNotNull(response);
        assertEquals(true, response.getSuccess());
        assertEquals("Login successful", response.getMessage());
        assertEquals(1L, response.getUserId());
        assertNull(response.getLoginId());
        assertEquals("STUDENT", response.getRole());
        assertEquals("Vijay", response.getName());

        verify(userRepository).findByLoginId(request.getLoginId());
        verify(passwordEncoder).matches(request.getPassword(), studentUser.getPassword());
    }

    /**
     * Test login fails with invalid credentials.
     */
    @Test
    void login_InvalidCredentials_ThrowsException() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setLoginId("vijay@gmail.com");
        request.setPassword("wrongPassword");

        when(userRepository.findByLoginId(request.getLoginId())).thenReturn(Optional.of(studentUser));
        when(passwordEncoder.matches(request.getPassword(), studentUser.getPassword())).thenReturn(false);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.login(request);
        });

        assertEquals("Invalid login ID or password", exception.getMessage());
        verify(userRepository).findByLoginId(request.getLoginId());
        verify(passwordEncoder).matches(request.getPassword(), studentUser.getPassword());
    }
}
