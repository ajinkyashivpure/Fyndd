package com.fyndd.backend.model;

import lombok.*;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {
    private String faceShape;
    private String skinTone;
    private String bodyType;
    private String stylePreference;
    private String colorSeason;
    private List<String> favoriteColors;
    private Map<String, Object> measurements;
}