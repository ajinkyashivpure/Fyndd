package com.fyndd.backend.controller;

import com.fyndd.backend.model.*;
import com.fyndd.backend.service.AIServiceClient;
import com.fyndd.backend.service.FashionService;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/fashion")
@Slf4j
@RequiredArgsConstructor
@Validated
public class FashionController {

    private final FashionService fashionService;
    private final AIServiceClient aiServiceClient;

    /**
     * Virtual try-on endpoint
     * POST /api/fashion/tryon
     */
    @PostMapping(value = "/tryon", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TryOnResponse> virtualTryOn(
            @RequestParam("userId") @NotBlank String userId,
            @RequestParam("userImage") MultipartFile userImage,
            @RequestParam("clothingImage") MultipartFile clothingImage) {

        try {
            log.info("Received try-on request for user: {}", userId);

            // Validate files
            validateImageFile(userImage, "userImage");
            validateImageFile(clothingImage, "clothingImage");

            TryOnResponse response = fashionService.processTryOn(userId, userImage, clothingImage);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.error("Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(TryOnResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .build());
        } catch (Exception e) {
            log.error("Error processing try-on request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(TryOnResponse.builder()
                            .success(false)
                            .message("Failed to process try-on: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Style feedback endpoint
     * POST /api/fashion/feedback
     */
    @PostMapping(value = "/feedback", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FeedbackResponse> styleFeedback(
            @RequestParam("userId") @NotBlank String userId,
            @RequestParam("tryonResultId") @NotBlank String tryonResultId,
            @RequestParam("userImage") MultipartFile userImage,
            @RequestParam("clothingImage") MultipartFile clothingImage,
            @RequestParam("generatedImage") MultipartFile generatedImage) {

        try {
            log.info("Received feedback request for try-on result: {}", tryonResultId);

            // Validate files
            validateImageFile(userImage, "userImage");
            validateImageFile(clothingImage, "clothingImage");
            validateImageFile(generatedImage, "generatedImage");

            FeedbackResponse response = fashionService.generateFeedback(
                    userId, tryonResultId, userImage, clothingImage, generatedImage);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.error("Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(FeedbackResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .build());
        } catch (Exception e) {
            log.error("Error generating feedback", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(FeedbackResponse.builder()
                            .success(false)
                            .message("Failed to generate feedback: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Personalized recommendations endpoint
     * POST /api/fashion/recommend
     */
    @PostMapping(value = "/recommend", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RecommendationResponse> personalizedRecommendations(
            @RequestParam("userId") @NotBlank String userId,
            @RequestParam("userImage") MultipartFile userImage) {

        try {
            log.info("Received recommendation request for user: {}", userId);

            // Validate file
            validateImageFile(userImage, "userImage");

            RecommendationResponse response = fashionService.generateRecommendations(userId, userImage);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.error("Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(RecommendationResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .build());
        } catch (Exception e) {
            log.error("Error generating recommendations", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(RecommendationResponse.builder()
                            .success(false)
                            .message("Failed to generate recommendations: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Get user's try-on history
     * GET /api/fashion/tryon/history/{userId}
     */
    @GetMapping("/tryon/history/{userId}")
    public ResponseEntity<List<TryOnResult>> getTryOnHistory(@PathVariable String userId) {
        try {
            List<TryOnResult> history = fashionService.getUserTryOnHistory(userId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            log.error("Error fetching try-on history", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get user's feedback history
     * GET /api/fashion/feedback/history/{userId}
     */
    @GetMapping("/feedback/history/{userId}")
    public ResponseEntity<List<StyleFeedback>> getFeedbackHistory(@PathVariable String userId) {
        try {
            List<StyleFeedback> history = fashionService.getUserFeedbackHistory(userId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            log.error("Error fetching feedback history", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get user's recommendations
     * GET /api/fashion/recommend/history/{userId}
     */
    @GetMapping("/recommend/history/{userId}")
    public ResponseEntity<List<StyleRecommendation>> getRecommendations(@PathVariable String userId) {
        try {
            List<StyleRecommendation> recommendations = fashionService.getUserRecommendations(userId);
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            log.error("Error fetching recommendations", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Health check endpoint
     * GET /api/fashion/health
     */
    @GetMapping("/health")
    public ResponseEntity<HealthCheckResponse> healthCheck() {
        boolean aiServiceHealthy = aiServiceClient.checkHealth();

        HealthCheckResponse response = HealthCheckResponse.builder()
                .status(aiServiceHealthy ? "healthy" : "degraded")
                .timestamp(LocalDateTime.now())
                .aiServiceStatus(aiServiceHealthy ? "connected" : "unavailable")
                .build();

        return ResponseEntity.ok(response);
    }

    // Validation helper methods

    private void validateImageFile(MultipartFile file, String fieldName) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(fieldName + " is required");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException(fieldName + " must be an image file");
        }

        // Check file size (max 10MB)
        long maxSize = 10 * 1024 * 1024; // 10MB
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException(fieldName + " size must not exceed 10MB");
        }

        // Check supported formats
        List<String> supportedFormats = List.of("image/jpeg", "image/jpg", "image/png");
        if (!supportedFormats.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException(fieldName + " must be in JPEG or PNG format");
        }
    }

    // Response model for health check
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    private static class HealthCheckResponse {
        private String status;
        private LocalDateTime timestamp;
        private String aiServiceStatus;
    }
}
