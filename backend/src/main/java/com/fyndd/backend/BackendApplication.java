package com.fyndd.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();
        System.setProperty("TOGETHER_AI_API_KEY", dotenv.get("TOGETHER_AI_API_KEY"));
        System.setProperty("MONGODB_ATLAS_URI", dotenv.get("MONGODB_ATLAS_URI"));
        System.setProperty("TOGETHER_AI_EMBEDDING_MODEL", dotenv.get("TOGETHER_AI_EMBEDDING_MODEL"));
        System.setProperty("TOGETHER_AI_BASE_URL", dotenv.get("TOGETHER_AI_BASE_URL"));
        System.setProperty("brevo.api-key", dotenv.get("BREVO_API_KEY"));
        System.setProperty("aws.s3.access-key", dotenv.get("AWS_ACCESS_KEY_ID"));
        System.setProperty("aws.s3.secret-key", dotenv.get("AWS_SECRET_ACCESS_KEY"));
        System.setProperty("aws.s3.bucket-name", dotenv.get("S3_BUCKET_NAME"));
        System.setProperty("aws.s3.region", dotenv.get("AWS_REGION"));
        System.setProperty("ai.service.base-url", dotenv.get("AI_SERVICE_URL"));

        SpringApplication.run(BackendApplication.class, args);
    }

}
