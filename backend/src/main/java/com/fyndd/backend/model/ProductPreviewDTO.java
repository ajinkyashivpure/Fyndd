package com.fyndd.backend.model;

import java.math.BigDecimal;

public class ProductPreviewDTO {
    private String id;
    private String title;
    private BigDecimal price;
    private String description;
    private String imageUrl;
    private String url;

    public ProductPreviewDTO(String id , String title, BigDecimal price, String description, String imageUrl, String url
    ) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.url = url;
    }

    // Getters and setters (or use Lombok: @Getter @AllArgsConstructor)


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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
