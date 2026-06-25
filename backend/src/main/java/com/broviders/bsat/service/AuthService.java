package com.broviders.bsat.service;

import com.broviders.bsat.dto.AuthResponse;
import com.broviders.bsat.dto.LoginRequest;
import com.broviders.bsat.dto.RegisterRequest;
import com.broviders.bsat.entity.Role;
import com.broviders.bsat.entity.User;
import com.broviders.bsat.repository.RoleRepository;
import com.broviders.bsat.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service class that contains business logic for authentication.
 * Handles user registration and login processes.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Registers a new user in the system.
     * Checks login ID uniqueness, hashes the password, assigns the role, and persists the user.
     *
     * @param request the registration details
     * @return an AuthResponse containing user details upon success
     * @throws IllegalArgumentException if the login ID is already registered or the role does not exist
     */
    public AuthResponse register(RegisterRequest request) {
        // 1. Login ID uniqueness validation
        if (userRepository.existsByLoginId(request.getLoginId())) {
            throw new IllegalArgumentException("Login ID is already registered!");
        }

        // 2. Fetch the corresponding role from the database
        // Convert the input string (e.g., "student") to uppercase to match the database role name ("STUDENT")
        String uppercaseRole = request.getRole().toUpperCase();
        Role role = roleRepository.findByName(uppercaseRole)
                .orElseThrow(() -> new IllegalArgumentException("Role not found: " + request.getRole()));

        // 3. Create the User entity and hash the raw password using BCrypt
        User user = User.builder()
                .name(request.getName())
                .loginId(request.getLoginId())
                .password(passwordEncoder.encode(request.getPassword())) // BCrypt hashing
                .role(role)
                .build();

        // 4. Save the user to the database
        User savedUser = userRepository.save(user);

        // 5. Construct and return a user-friendly AuthResponse
        return new AuthResponse(
                "User registered successfully",
                savedUser.getLoginId(),
                savedUser.getRole().getName(),
                savedUser.getName()
        );
    }

    /**
     * Authenticates a user trying to log in.
     * Verifies the login ID exists and the password matches the BCrypt hash.
     *
     * @param request the login credentials
     * @return an AuthResponse containing user details upon success
     * @throws IllegalArgumentException if the login ID is not found or the password is incorrect
     */
    public AuthResponse login(LoginRequest request) {
        // 1. Find the user by their login ID
        User user = userRepository.findByLoginId(request.getLoginId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid login ID or password"));

        // 2. Verify if the raw login password matches the BCrypt hash stored in the database
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid login ID or password");
        }

        // 3. Return a successful AuthResponse containing the required fields
        return AuthResponse.builder()
                .success(true)
                .message("Login successful")
                .userId(user.getId())
                .name(user.getName())
                .role(user.getRole().getName())
                .build();
    }
}
