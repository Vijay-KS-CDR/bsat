package com.broviders.bsat.dto;

import lombok.*;
import java.util.List;

/**
 * DTO wrapping a collection of QuestionResponse objects.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionListResponse {
    private List<QuestionResponse> questions;
}
