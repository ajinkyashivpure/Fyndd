package com.fyndd.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIRecommendationResponse {
    private boolean success;
    private Map<String, Object> userProfile;
    private List<Map<String, Object>> recommendedStyles;
    private List<String> colorPalette;
    private String bodyTypeAnalysis;
}