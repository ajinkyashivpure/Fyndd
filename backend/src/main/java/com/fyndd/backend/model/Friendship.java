package com.fyndd.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "friendships")
public class Friendship {
    @Id
    private String id;

    @Indexed
    private String userId1;

    @Indexed
    private String userId2;

    private LocalDateTime createdAt;

    // Constructors, getters, setters
    public Friendship() {}

    public Friendship(String userId1, String userId2) {
        this.userId1 = userId1;
        this.userId2 = userId2;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId1() { return userId1; }
    public void setUserId1(String userId1) { this.userId1 = userId1; }

    public String getUserId2() { return userId2; }
    public void setUserId2(String userId2) { this.userId2 = userId2; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}