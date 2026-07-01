package com.broviders.bsat.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EvaluateDescriptiveRequest {

    @NotNull(message = "Marks awarded is required")
    private Double marksAwarded;

    private String remarks;

    private Long teacherId; // Optional or fetched from session/header
}
