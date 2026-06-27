package com.broviders.bsat.dto;

import lombok.*;
import java.util.List;

/**
 * Data Transfer Object wrapping a list of StudentResponse objects.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentListResponse {
    private List<StudentResponse> students;
}
