package com.fyndd.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIFeedbackResponse {
    private boolean success;
    private String feedback;
    private double styleScore;
    private Map<String, String> fitAnalysis;
    private String colorHarmony;
    private List<String> suggestions;
}
