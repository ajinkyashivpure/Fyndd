package com.fyndd.backend.model;

import java.util.List;

public class UserCartsDTO {
    private String userId;
    private String userName;
    private List<CartDetailsDTO> carts;

    public List<CartDetailsDTO> getCarts() {
        return carts;
    }

    public void setCarts(List<CartDetailsDTO> carts) {
        this.carts = carts;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
