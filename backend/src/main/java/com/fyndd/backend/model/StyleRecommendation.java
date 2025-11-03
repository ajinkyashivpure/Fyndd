package com.fyndd.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "style_recommendations")
public class StyleRecommendation {
    @Id
    private String id;
    private String userId;
    private UserProfile userProfile;
    private List<StyleItem> recommendedStyles;
    private List<String> colorPalette;
    private String bodyTypeAnalysis;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
}