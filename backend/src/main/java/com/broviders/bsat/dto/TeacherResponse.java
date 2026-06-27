package com.broviders.bsat.dto;

import lombok.*;
import java.time.LocalDateTime;

/**
 * Data Transfer Object representing the output payload for teacher queries.
 * Flattens the linked User details into single properties and hides password.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherResponse {
    private Long id;
    private Long userId;
    private String name;
    private String loginId;
    private String role;
    private String employeeId;
    private String phone;
    private String qualification;
    private Integer experience;
    private String address;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
