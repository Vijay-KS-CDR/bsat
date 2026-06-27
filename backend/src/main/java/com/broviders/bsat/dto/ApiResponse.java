package com.broviders.bsat.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

/**
 * Generic response container matching the Question Bank API JSON structure.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
}
