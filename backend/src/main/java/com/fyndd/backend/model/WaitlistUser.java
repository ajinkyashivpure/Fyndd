package com.fyndd.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "waitlist")
public class WaitlistUser {

    @Id
    private String id;

    private String email;
    private LocalDateTime createdAt = LocalDateTime.now();

    public WaitlistUser() {}

    public WaitlistUser(String email) {
        this.email = email;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
