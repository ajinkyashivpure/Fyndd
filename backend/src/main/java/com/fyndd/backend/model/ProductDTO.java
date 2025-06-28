package com.fyndd.backend.model;

import java.math.BigDecimal;

public class ProductDTO {
    private String title;
    private BigDecimal price;
    private String url;
    private String imageUrl;
    private String description;

    // Constructor
    public ProductDTO(String title, BigDecimal price, String url, String imageUrl, String description) {
        this.title = title;
        this.price = price;
        this.url = url;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    // Getters and setters (or use Lombok @Data)

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
