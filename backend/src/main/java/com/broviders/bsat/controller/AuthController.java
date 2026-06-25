package com.broviders.bsat.controller;

import com.broviders.bsat.dto.AuthResponse;
import com.broviders.bsat.dto.LoginRequest;
import com.broviders.bsat.dto.RegisterRequest;
import com.broviders.bsat.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for handling Authentication requests.
 * Exposes endpoints for user registration and login.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Endpoint for user registration.
     * Receives registration details, validates them, and registers the user.
     *
     * @param request the validated registration request
     * @return 200 OK with AuthResponse on success, or 400 Bad Request with an error message
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            // Call service layer to perform business registration logic
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            // Return 400 Bad Request if validation rules or business checks fail (e.g., login ID already exists)
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint for user login.
     * Receives login credentials, validates them, and checks authentication.
     *
     * @param request the validated login request
     * @return 200 OK with AuthResponse on success, or 400 Bad Request with an error message
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            // Call service layer to authenticate the user
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            // Return 400 Bad Request if login ID/password is incorrect
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
