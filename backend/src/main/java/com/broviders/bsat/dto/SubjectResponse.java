package com.broviders.bsat.dto;

import lombok.*;
import java.time.LocalDateTime;

/**
 * DTO representing the output payload for subject queries.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectResponse {
    private Long id;
    private String subjectCode;
    private String subjectName;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
