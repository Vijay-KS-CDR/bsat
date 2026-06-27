package com.broviders.bsat.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * DTO representing a request to register a new subject.
 */
@Data
public class CreateSubjectRequest {

    @NotBlank(message = "Subject code is required")
    @Size(min = 3, max = 20, message = "Subject code must be between 3 and 20 characters")
    private String subjectCode;

    @NotBlank(message = "Subject name is required")
    @Size(min = 3, max = 100, message = "Subject name must be between 3 and 100 characters")
    private String subjectName;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(ACTIVE|INACTIVE)$", message = "Status must be ACTIVE or INACTIVE")
    private String status = "ACTIVE";
}
