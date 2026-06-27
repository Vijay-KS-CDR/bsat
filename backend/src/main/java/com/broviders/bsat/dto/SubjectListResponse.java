package com.broviders.bsat.dto;

import lombok.*;
import java.util.List;

/**
 * Data Transfer Object wrapping a list of SubjectResponse objects.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectListResponse {
    private List<SubjectResponse> subjects;
}
