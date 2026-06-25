package com.broviders.bsat.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Data Transfer Object representing a user login request.
 * Contains fields for credentials validation.
 */
@Data
public class LoginRequest {

    /**
     * The login ID of the user trying to log in.
     * Cannot be blank.
     */
    @NotBlank(message = "Login ID is required")
    private String loginId;

    /**
     * The user's raw password. Cannot be blank.
     */
    @NotBlank(message = "Password is required")
    private String password;
}
