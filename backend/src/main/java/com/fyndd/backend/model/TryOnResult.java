package com.fyndd.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tryon_results")
public class TryOnResult {
    @Id
    private String id;
    private String userId;
    private String userImageUrl;
    private String clothingImageUrl;
    private String generatedImageUrl;
    private int processingTimeMs;
    private String modelUsed;
    private TryOnStatus status;
    private LocalDateTime createdAt;
}