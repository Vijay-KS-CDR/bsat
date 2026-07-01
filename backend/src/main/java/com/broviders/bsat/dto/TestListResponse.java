package com.broviders.bsat.dto;

import lombok.*;
import java.util.List;

/**
 * Data Transfer Object wrapping a list of TestResponse objects.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestListResponse {
    private List<TestResponse> tests;
}
