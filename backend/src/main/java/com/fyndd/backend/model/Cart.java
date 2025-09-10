package com.fyndd.backend.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "carts")
public class Cart {

    @Id
    private String id;

    private String userId;
    private CartType cartType;

    private List<String> productIds = new ArrayList<>();

    // Constructors
    public Cart() {}

    public Cart(String userId, CartType cartType) {
        this.userId = userId;
        this.cartType = cartType;
        this.productIds = new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<String> getProductIds() {
        return productIds;
    }

    public void setProductIds(List<String> productIds) {
        this.productIds = productIds;
    }

    public CartType getCartType() {
        return cartType;
    }

    public void setCartType(CartType cartType) {
        this.cartType = cartType;
    }

    public void addProductId(String productId) {
        if (!this.productIds.contains(productId)) {
            this.productIds.add(productId);
        }
    }

    public boolean removeProductId(String productId) {
        return this.productIds.remove(productId);
    }

    public void clearProducts() {
        this.productIds.clear();
    }
}
