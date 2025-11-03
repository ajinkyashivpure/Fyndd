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
public class RecommendationResponse {
    private boolean success;
    private String recommendationId;
    private UserProfile userProfile;
    private List<StyleItem> recommendedStyles;
    private List<String> colorPalette;
    private String bodyTypeAnalysis;
    private String message;
}
