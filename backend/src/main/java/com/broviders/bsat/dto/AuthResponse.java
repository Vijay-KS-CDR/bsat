package com.broviders.bsat.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object representing the authentication response.
 * Sent back to the client upon successful registration or login.
 * Omit null fields in JSON response.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {

    /**
     * Indicates whether the authentication operation was successful.
     */
    private Boolean success;

    /**
     * Informational message about the status of the request (e.g., "Login successful").
     */
    private String message;

    /**
     * The database user ID of the authenticated user.
     */
    private Long userId;

    /**
     * The login ID of the authenticated user.
     */
    private String loginId;

    /**
     * The role assigned to the user (e.g., STUDENT, TEACHER, ADMIN).
     */
    private String role;

    /**
     * The full name of the user.
     */
    private String name;

    /**
     * The JWT access token.
     */
    private String token;

    /**
     * Nested user info object matching requested layout.
     */
    private UserInfo user;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class UserInfo {
        private Long id;
        private String loginId;
        private String role;
        private String name;
    }

    /**
     * 4-argument constructor to prevent breaking the working Register API.
     *
     * @param message registration status message
     * @param loginId user login ID
     * @param role role name
     * @param name user name
     */
    public AuthResponse(String message, String loginId, String role, String name) {
        this.message = message;
        this.success = true;
        this.loginId = loginId;
        this.role = role;
        this.name = name;
        this.user = UserInfo.builder()
                .loginId(loginId)
                .role(role)
                .name(name)
                .build();
    }
}
