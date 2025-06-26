package com.fyndd.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BackendApplicationTests {

    @BeforeAll
    static void setup() {
        Dotenv dotenv = Dotenv.load();
        System.setProperty("MONGODB_ATLAS_URI", dotenv.get("MONGODB_ATLAS_URI"));
        System.setProperty("TOGETHER_AI_API_KEY", dotenv.get("TOGETHER_AI_API_KEY"));
        System.setProperty("TOGETHER_AI_EMBEDDING_MODEL", dotenv.get("TOGETHER_AI_EMBEDDING_MODEL"));
        System.setProperty("TOGETHER_AI_BASE_URL", dotenv.get("TOGETHER_AI_BASE_URL"));
    }

    @Test
    void contextLoads() {
    }

}
