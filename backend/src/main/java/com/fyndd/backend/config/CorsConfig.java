package com.fyndd.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")  // apply to all paths
                        .allowedOrigins("https://www.fyndd.in", "https://fyndd.in")  // frontend origin
                        .allowedMethods("*")  // GET, POST, PUT, DELETE, etc.
                        .allowedHeaders("*")
                        .allowCredentials(true);  // if sending cookies/auth headers
            }
        };
    }
}
