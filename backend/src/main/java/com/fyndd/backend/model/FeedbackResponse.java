package com.fyndd.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackResponse {
    private boolean success;
    private String feedbackId;
    private String feedback;
    private double styleScore;
    private FitAnalysis fitAnalysis;
    private String colorHarmony;
    private List<String> suggestions;
    private String message;
}