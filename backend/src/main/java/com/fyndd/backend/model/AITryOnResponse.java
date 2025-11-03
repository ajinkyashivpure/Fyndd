package com.fyndd.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AITryOnResponse {
    private boolean success;
    private String generatedImageUrl;
    private int processingTimeMs;
    private String modelUsed;
}