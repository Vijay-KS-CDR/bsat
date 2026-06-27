package com.broviders.bsat.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

/**
 * Data Transfer Object representing a request to create a new student.
 * Maps both the Student fields and corresponding User details.
 */
@Data
public class CreateStudentRequest {

    @NotBlank(message = "Student name is required")
    @Size(min = 3, max = 100, message = "Student name must be between 3 and 100 characters")
    private String name;

    @NotBlank(message = "Login ID is required")
    @Size(min = 3, max = 100, message = "Login ID must be between 3 and 100 characters")
    private String loginId;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank(message = "Admission number is required")
    private String admissionNumber;

    @NotBlank(message = "Class name is required")
    private String className;

    @NotBlank(message = "Section is required")
    private String section;

    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "^(MALE|FEMALE|OTHER)$", message = "Gender must be MALE, FEMALE, or OTHER")
    private String gender;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Parent name is required")
    private String parentName;

    @NotBlank(message = "Parent phone is required")
    @Pattern(regexp = "^\\d{10}$", message = "Parent phone must be exactly 10 digits")
    private String parentPhone;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(ACTIVE|INACTIVE)$", message = "Status must be ACTIVE or INACTIVE")
    private String status = "ACTIVE";
}
