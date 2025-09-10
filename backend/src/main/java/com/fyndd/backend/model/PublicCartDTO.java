package com.fyndd.backend.model;

import java.util.List;

public class PublicCartDTO {
    private String userId;
    private String username;
    private List<CartProductDTO> publicCartProducts;

    // Constructors
    public PublicCartDTO() {}

    public PublicCartDTO(String userId, String username, List<CartProductDTO> publicCartProducts) {
        this.userId = userId;
        this.username = username;
        this.publicCartProducts = publicCartProducts;
    }

    // Getters and Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<CartProductDTO> getPublicCartProducts() {
        return publicCartProducts;
    }

    public void setPublicCartProducts(List<CartProductDTO> publicCartProducts) {
        this.publicCartProducts = publicCartProducts;
    }

}