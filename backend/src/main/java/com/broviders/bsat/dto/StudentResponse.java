package com.broviders.bsat.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Data Transfer Object representing the output payload for student queries.
 * Flattens the linked User details into single properties and hides password.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResponse {
    private Long id;
    private Long userId;
    private String name;
    private String loginId;
    private String role;
    private String admissionNumber;
    private String className;
    private String section;
    private String gender;
    private LocalDate dateOfBirth;
    private String parentName;
    private String parentPhone;
    private String address;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
