package com.fyndd.backend.model;

import java.util.List;

public class CartDetailsDTO {
    private String cartId;
    private String cartName;
    private String cartVisibility;
    private List<CartProductDTO> products;

    public String getCartId() {
        return cartId;
    }

    public void setCartId(String cartId) {
        this.cartId = cartId;
    }

    public String getCartName() {
        return cartName;
    }

    public void setCartName(String cartName) {
        this.cartName = cartName;
    }

    public String getCartVisibility() {
        return cartVisibility;
    }

    public void setCartVisibility(String cartVisibility) {
        this.cartVisibility = cartVisibility;
    }

    public List<CartProductDTO> getProducts() {
        return products;
    }

    public void setProducts(List<CartProductDTO> products) {
        this.products = products;
    }
}
