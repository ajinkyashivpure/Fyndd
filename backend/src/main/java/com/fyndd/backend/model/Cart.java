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
    private CartVisibility cartVisibility;
    private String name;

    private List<String> productIds = new ArrayList<>();

    // Constructors
    public Cart() {}

    public Cart(String userId, CartVisibility cartVisibility) {
        this.userId = userId;
        this.cartVisibility = cartVisibility;
        this.productIds = new ArrayList<>();
    }

    public Cart(String userId, String name , CartVisibility cartVisibility) {
        this.userId = userId;
        this.cartVisibility = cartVisibility;
        this.name = name;
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

    public CartVisibility getCartType() {
        return cartVisibility;
    }

    public void setCartType(CartVisibility cartVisibility) {
        this.cartVisibility = cartVisibility;
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

    public CartVisibility getCartVisibility() {
        return cartVisibility;
    }

    public void setCartVisibility(CartVisibility cartVisibility) {
        this.cartVisibility = cartVisibility;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
