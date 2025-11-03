package com.fyndd.backend.config;

import lombok.Data;
//import org.apache.http.client.HttpClient;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

//import java.net.http.HttpClient;
import java.time.Duration;

@Configuration
@ConfigurationProperties(prefix = "ai.service")
@Data
public class AIServiceConfig {
    private String baseUrl;
    private long timeout;
    private RetryConfig retry;

    @Data
    public static class RetryConfig {
        private int maxAttempts;
        private long delay;
    }

    @Bean
    public WebClient aiServiceWebClient() {
        HttpClient httpClient = HttpClient.create()
                .responseTimeout(Duration.ofMillis(timeout));

        return WebClient.builder()
                .baseUrl(baseUrl)
                .clientConnector(new ReactorClientHttpConnector())
                .build();
    }
}
