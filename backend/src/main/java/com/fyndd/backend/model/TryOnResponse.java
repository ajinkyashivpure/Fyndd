package com.fyndd.backend.model;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TryOnResponse {
    private boolean success;
    private String resultId;
    private String generatedImageUrl;
    private int processingTimeMs;
    private String modelUsed;
    private String message;
}