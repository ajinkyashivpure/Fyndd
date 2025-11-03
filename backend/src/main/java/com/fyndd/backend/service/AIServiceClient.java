package com.fyndd.backend.service;

import com.fyndd.backend.config.AIServiceConfig;
import com.fyndd.backend.model.AIFeedbackResponse;
import com.fyndd.backend.model.AIRecommendationResponse;
import com.fyndd.backend.model.AITryOnResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.io.IOException;
import java.time.Duration;

@Service
@Slf4j
@RequiredArgsConstructor
public class AIServiceClient {

    private final WebClient aiServiceWebClient;
    private final AIServiceConfig aiServiceConfig;

    @Value("${ai.service.base-url}")
    private String aiServiceBaseUrl;

    /**
     * Call AI service for virtual try-on
     */
    public AITryOnResponse callTryOnService(MultipartFile userImage, MultipartFile clothingImage) {
        try {
            log.info("Calling AI try-on service");

            MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();
            bodyBuilder.part("user_image",
                            new ByteArrayResource(userImage.getBytes()),
                            MediaType.IMAGE_JPEG)
                    .filename(userImage.getOriginalFilename());

            bodyBuilder.part("clothing_image",
                            new ByteArrayResource(clothingImage.getBytes()),
                            MediaType.IMAGE_JPEG)
                    .filename(clothingImage.getOriginalFilename());

            return aiServiceWebClient
                    .post()
                    .uri(aiServiceBaseUrl+"/tryon")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(bodyBuilder.build()))
                    .retrieve()
                    .bodyToMono(AITryOnResponse.class)
                    .retryWhen(createRetrySpec())
                    .doOnSuccess(response -> log.info("Try-on service call successful"))
                    .doOnError(error -> log.error("Try-on service call failed", error))
                    .block();

        } catch (IOException e) {
            log.error("Error reading image files", e);
            throw new RuntimeException("Failed to read image files", e);
        } catch (WebClientResponseException e) {
            log.error("AI service returned error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("AI service error: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error calling try-on service", e);
            throw new RuntimeException("Failed to call try-on service", e);
        }
    }

    /**
     * Call AI service for style feedback
     */
    public AIFeedbackResponse callFeedbackService(
            MultipartFile userImage,
            MultipartFile clothingImage,
            MultipartFile generatedImage) {

        try {
            log.info("Calling AI feedback service");

            MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();

            bodyBuilder.part("user_image",
                            new ByteArrayResource(userImage.getBytes()),
                            MediaType.IMAGE_JPEG)
                    .filename(userImage.getOriginalFilename());

            bodyBuilder.part("clothing_image",
                            new ByteArrayResource(clothingImage.getBytes()),
                            MediaType.IMAGE_JPEG)
                    .filename(clothingImage.getOriginalFilename());

            bodyBuilder.part("generated_image",
                            new ByteArrayResource(generatedImage.getBytes()),
                            MediaType.IMAGE_JPEG)
                    .filename(generatedImage.getOriginalFilename());

            return aiServiceWebClient
                    .post()
                    .uri("/feedback")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(bodyBuilder.build()))
                    .retrieve()
                    .bodyToMono(AIFeedbackResponse.class)
                    .retryWhen(createRetrySpec())
                    .doOnSuccess(response -> log.info("Feedback service call successful"))
                    .doOnError(error -> log.error("Feedback service call failed", error))
                    .block();

        } catch (IOException e) {
            log.error("Error reading image files", e);
            throw new RuntimeException("Failed to read image files", e);
        } catch (WebClientResponseException e) {
            log.error("AI service returned error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("AI service error: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error calling feedback service", e);
            throw new RuntimeException("Failed to call feedback service", e);
        }
    }

    /**
     * Call AI service for personalized recommendations
     */
    public AIRecommendationResponse callRecommendationService(MultipartFile userImage) {
        try {
            log.info("Calling AI recommendation service");

            MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();
            bodyBuilder.part("user_image",
                            new ByteArrayResource(userImage.getBytes()),
                            MediaType.IMAGE_JPEG)
                    .filename(userImage.getOriginalFilename());

            return aiServiceWebClient
                    .post()
                    .uri("/recommend")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(bodyBuilder.build()))
                    .retrieve()
                    .bodyToMono(AIRecommendationResponse.class)
                    .retryWhen(createRetrySpec())
                    .doOnSuccess(response -> log.info("Recommendation service call successful"))
                    .doOnError(error -> log.error("Recommendation service call failed", error))
                    .block();

        } catch (IOException e) {
            log.error("Error reading image file", e);
            throw new RuntimeException("Failed to read image file", e);
        } catch (WebClientResponseException e) {
            log.error("AI service returned error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("AI service error: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error calling recommendation service", e);
            throw new RuntimeException("Failed to call recommendation service", e);
        }
    }

    /**
     * Check if AI service is healthy
     */
    public boolean checkHealth() {
        try {
            String response = aiServiceWebClient
                    .get()
                    .uri("/health")
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(5))
                    .block();

            return response != null && response.contains("healthy");

        } catch (Exception e) {
            log.error("AI service health check failed", e);
            return false;
        }
    }

    /**
     * Create retry specification for resilient API calls
     */
    private Retry createRetrySpec() {
        return Retry.backoff(
                        aiServiceConfig.getRetry().getMaxAttempts(),
                        Duration.ofMillis(aiServiceConfig.getRetry().getDelay())
                )
                .filter(throwable -> throwable instanceof WebClientResponseException &&
                        ((WebClientResponseException) throwable).getStatusCode().is5xxServerError())
                .doBeforeRetry(retrySignal ->
                        log.warn("Retrying AI service call, attempt: {}", retrySignal.totalRetries() + 1)
                );
    }
}