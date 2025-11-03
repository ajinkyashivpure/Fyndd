package com.fyndd.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "style_feedbacks")
public class StyleFeedback {
    @Id
    private String id;
    private String userId;
    private String tryonResultId;
    private String feedback;
    private double styleScore;
    private FitAnalysis fitAnalysis;
    private String colorHarmony;
    private List<String> suggestions;
    private LocalDateTime createdAt;
}
