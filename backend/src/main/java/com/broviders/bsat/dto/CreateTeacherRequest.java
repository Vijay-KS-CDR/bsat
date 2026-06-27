package com.broviders.bsat.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * Data Transfer Object representing a request to create a new teacher.
 * Maps both the Teacher fields and corresponding User details.
 */
@Data
public class CreateTeacherRequest {

    @NotBlank(message = "Teacher name is required")
    @Size(min = 3, max = 100, message = "Teacher name must be between 3 and 100 characters")
    private String name;

    @NotBlank(message = "Employee ID is required")
    private String employeeId;

    @NotBlank(message = "Login ID is required")
    @Size(min = 3, max = 100, message = "Login ID must be between 3 and 100 characters")
    private String loginId;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\d{10}$", message = "Phone must be exactly 10 digits")
    private String phone;

    @NotBlank(message = "Qualification is required")
    @Size(max = 150, message = "Qualification must not exceed 150 characters")
    private String qualification;

    @NotNull(message = "Experience is required")
    @Min(value = 0, message = "Experience must be at least 0 years")
    @Max(value = 50, message = "Experience must not exceed 50 years")
    private Integer experience;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(ACTIVE|INACTIVE)$", message = "Status must be ACTIVE or INACTIVE")
    private String status = "ACTIVE";
}
