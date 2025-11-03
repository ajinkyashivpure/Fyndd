package com.fyndd.backend.service;

import com.fyndd.backend.model.*;
import com.fyndd.backend.repository.StyleFeedbackRepository;
import com.fyndd.backend.repository.StyleRecommendationRepository;
import com.fyndd.backend.repository.TryOnResultRepository;
import com.fyndd.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class FashionService {

    private final AIServiceClient aiServiceClient;
    private final S3Service s3Service;
    private final TryOnResultRepository tryOnResultRepository;
    private final StyleFeedbackRepository styleFeedbackRepository;
    private final StyleRecommendationRepository styleRecommendationRepository;
    private final UserRepository userRepository;

    /**
     * Process virtual try-on request
     */
    @Transactional
    public TryOnResponse processTryOn(String userId, MultipartFile userImage, MultipartFile clothingImage) {
        try {
            log.info("Processing try-on request for user: {}", userId);

            // Validate user exists
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));

            // Upload original images to S3
            String userImageUrl = s3Service.uploadFile(userImage, "user-images");
            String clothingImageUrl = s3Service.uploadFile(clothingImage, "clothing-images");

            log.info("Images uploaded to S3. User: {}, Clothing: {}", userImageUrl, clothingImageUrl);

            // Create initial try-on result record
            TryOnResult tryOnResult = TryOnResult.builder()
                    .userId(userId)
                    .userImageUrl(userImageUrl)
                    .clothingImageUrl(clothingImageUrl)
                    .status(TryOnStatus.PROCESSING)
                    .createdAt(LocalDateTime.now())
                    .build();

            tryOnResult = tryOnResultRepository.save(tryOnResult);
            log.info("Try-on result record created with ID: {}", tryOnResult.getId());

            // Call AI service
            AITryOnResponse aiResponse = aiServiceClient.callTryOnService(userImage, clothingImage);

            // Update try-on result with AI response
            tryOnResult.setGeneratedImageUrl(aiResponse.getGeneratedImageUrl());
            tryOnResult.setProcessingTimeMs(aiResponse.getProcessingTimeMs());
            tryOnResult.setModelUsed(aiResponse.getModelUsed());
            tryOnResult.setStatus(TryOnStatus.COMPLETED);

            tryOnResult = tryOnResultRepository.save(tryOnResult);
            log.info("Try-on processing completed successfully");

            return TryOnResponse.builder()
                    .success(true)
                    .resultId(tryOnResult.getId())
                    .generatedImageUrl(aiResponse.getGeneratedImageUrl())
                    .processingTimeMs(aiResponse.getProcessingTimeMs())
                    .modelUsed(aiResponse.getModelUsed())
                    .message("Virtual try-on completed successfully")
                    .build();

        } catch (Exception e) {
            log.error("Error processing try-on request", e);
            throw new RuntimeException("Failed to process try-on: " + e.getMessage(), e);
        }
    }

    /**
     * Generate style feedback for a try-on result
     */
    @Transactional
    public FeedbackResponse generateFeedback(
            String userId,
            String tryonResultId,
            MultipartFile userImage,
            MultipartFile clothingImage,
            MultipartFile generatedImage) {

        try {
            log.info("Generating feedback for try-on result: {}", tryonResultId);

            // Validate try-on result exists
            TryOnResult tryOnResult = tryOnResultRepository.findById(tryonResultId)
                    .orElseThrow(() -> new RuntimeException("Try-on result not found: " + tryonResultId));

            if (!tryOnResult.getUserId().equals(userId)) {
                throw new RuntimeException("Unauthorized access to try-on result");
            }

            // Check if feedback already exists
            if (styleFeedbackRepository.findByTryonResultId(tryonResultId).isPresent()) {
                throw new RuntimeException("Feedback already exists for this try-on result");
            }

            // Call AI service for feedback
            AIFeedbackResponse aiResponse = aiServiceClient.callFeedbackService(
                    userImage, clothingImage, generatedImage);

            // Convert AI response to domain model
            FitAnalysis fitAnalysis = FitAnalysis.builder()
                    .length(aiResponse.getFitAnalysis().get("length"))
                    .width(aiResponse.getFitAnalysis().get("width"))
                    .proportion(aiResponse.getFitAnalysis().get("proportion"))
                    .build();

            // Create and save feedback
            StyleFeedback feedback = StyleFeedback.builder()
                    .userId(userId)
                    .tryonResultId(tryonResultId)
                    .feedback(aiResponse.getFeedback())
                    .styleScore(aiResponse.getStyleScore())
                    .fitAnalysis(fitAnalysis)
                    .colorHarmony(aiResponse.getColorHarmony())
                    .suggestions(aiResponse.getSuggestions())
                    .createdAt(LocalDateTime.now())
                    .build();

            feedback = styleFeedbackRepository.save(feedback);
            log.info("Style feedback generated successfully with ID: {}", feedback.getId());

            return FeedbackResponse.builder()
                    .success(true)
                    .feedbackId(feedback.getId())
                    .feedback(feedback.getFeedback())
                    .styleScore(feedback.getStyleScore())
                    .fitAnalysis(feedback.getFitAnalysis())
                    .colorHarmony(feedback.getColorHarmony())
                    .suggestions(feedback.getSuggestions())
                    .message("Style feedback generated successfully")
                    .build();

        } catch (Exception e) {
            log.error("Error generating feedback", e);
            throw new RuntimeException("Failed to generate feedback: " + e.getMessage(), e);
        }
    }

    /**
     * Generate personalized recommendations for a user
     */
    @Transactional
    public RecommendationResponse generateRecommendations(String userId, MultipartFile userImage) {
        try {
            log.info("Generating recommendations for user: {}", userId);

            // Validate user exists
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));

            // Check for existing valid recommendations (cached for performance)
            var existingRec = styleRecommendationRepository
                    .findValidRecommendation(userId, LocalDateTime.now());

            if (existingRec.isPresent()) {
                log.info("Returning cached recommendations for user: {}", userId);
                StyleRecommendation rec = existingRec.get();
                return buildRecommendationResponse(rec);
            }

            // Call AI service for recommendations
            AIRecommendationResponse aiResponse = aiServiceClient.callRecommendationService(userImage);

            // Convert AI response to domain model
            UserProfile userProfile = convertToUserProfile(aiResponse.getUserProfile());
            List<StyleItem> styleItems = convertToStyleItems(aiResponse.getRecommendedStyles());

            // Update user profile if it has changed
            if (user.getProfile() == null || !user.getProfile().equals(userProfile)) {
                user.setProfile(userProfile);
                userRepository.save(user);
            }

            // Create and save recommendations (expire after 30 days)
            StyleRecommendation recommendation = StyleRecommendation.builder()
                    .userId(userId)
                    .userProfile(userProfile)
                    .recommendedStyles(styleItems)
                    .colorPalette(aiResponse.getColorPalette())
                    .bodyTypeAnalysis(aiResponse.getBodyTypeAnalysis())
                    .createdAt(LocalDateTime.now())
                    .expiresAt(LocalDateTime.now().plusDays(30))
                    .build();

            recommendation = styleRecommendationRepository.save(recommendation);
            log.info("Recommendations generated successfully with ID: {}", recommendation.getId());

            return buildRecommendationResponse(recommendation);

        } catch (Exception e) {
            log.error("Error generating recommendations", e);
            throw new RuntimeException("Failed to generate recommendations: " + e.getMessage(), e);
        }
    }

    /**
     * Get user's try-on history
     */
    public List<TryOnResult> getUserTryOnHistory(String userId) {
        return tryOnResultRepository.findByUserId(userId);
    }

    /**
     * Get user's style feedback history
     */
    public List<StyleFeedback> getUserFeedbackHistory(String userId) {
        return styleFeedbackRepository.findByUserId(userId);
    }

    /**
     * Get user's recommendations
     */
    public List<StyleRecommendation> getUserRecommendations(String userId) {
        return styleRecommendationRepository.findByUserId(userId);
    }

    // Helper methods

    private UserProfile convertToUserProfile(Map<String, Object> profileMap) {
        return UserProfile.builder()
                .faceShape((String) profileMap.get("face_shape"))
                .skinTone((String) profileMap.get("skin_tone"))
                .bodyType((String) profileMap.get("body_type"))
                .stylePreference((String) profileMap.get("style_preference"))
                .colorSeason((String) profileMap.get("color_season"))
                .build();
    }

    private List<StyleItem> convertToStyleItems(List<Map<String, Object>> items) {
        return items.stream()
                .map(item -> StyleItem.builder()
                        .category((String) item.get("category"))
                        .style((String) item.get("style"))
                        .reason((String) item.get("reason"))
                        .examples((List<String>) item.get("examples"))
                        .build())
                .collect(Collectors.toList());
    }

    private RecommendationResponse buildRecommendationResponse(StyleRecommendation rec) {
        return RecommendationResponse.builder()
                .success(true)
                .recommendationId(rec.getId())
                .userProfile(rec.getUserProfile())
                .recommendedStyles(rec.getRecommendedStyles())
                .colorPalette(rec.getColorPalette())
                .bodyTypeAnalysis(rec.getBodyTypeAnalysis())
                .message("Recommendations retrieved successfully")
                .build();
    }
}