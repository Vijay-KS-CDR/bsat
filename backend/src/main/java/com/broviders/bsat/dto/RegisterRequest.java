package com.broviders.bsat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Data Transfer Object representing a user registration request.
 * Contains validation rules for creating a new user.
 */
@Data
public class RegisterRequest {

    /**
     * The full name of the user. Cannot be blank.
     */
    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
    private String name;

    /**
     * The login ID of the user. Cannot be blank.
     */
    @NotBlank(message = "Login ID is required")
    @Size(min = 3, max = 100, message = "Login ID must be between 3 and 100 characters")
    private String loginId;

    /**
     * The raw password chosen by the user.
     * Must be at least 8 characters long and cannot be blank.
     */
    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
    private String password;

    /**
     * The role name assigned to the user (e.g., ADMIN, TEACHER, STUDENT).
     * Cannot be blank.
     */
    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(ADMIN|TEACHER|STUDENT)$", message = "Role must be one of: ADMIN, TEACHER, STUDENT")
    private String role;
}
