package com.broviders.bsat.dto;

import lombok.*;
import java.util.List;

/**
 * Data Transfer Object wrapping a list of TeacherResponse objects.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherListResponse {
    private List<TeacherResponse> teachers;
}
