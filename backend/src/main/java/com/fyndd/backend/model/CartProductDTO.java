package com.fyndd.backend.model;

import java.math.BigDecimal;

public class CartProductDTO {
    private String id;
    private String title;
    private BigDecimal price;
    private String imageUrl;
    private String url;

    public CartProductDTO(String id, String title, BigDecimal price, String imageUrl, String url) {
        this.title = title;
        this.id = id;
        this.price = price;
        this.imageUrl = imageUrl;
        this.url = url;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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
}
