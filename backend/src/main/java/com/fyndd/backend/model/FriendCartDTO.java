package com.fyndd.backend.model;

import java.util.List;

public class FriendCartDTO {
    private String friendId;
    private String friendName;
    private List<CartProductDTO> cartProducts;

    // Constructors, getters, setters
    public FriendCartDTO() {}

    public FriendCartDTO(String friendId, String friendName, List<CartProductDTO> cartProducts) {
        this.friendId = friendId;
        this.friendName = friendName;
        this.cartProducts = cartProducts;
    }

    // Getters and setters
    public String getFriendId() { return friendId; }
    public void setFriendId(String friendId) { this.friendId = friendId; }

    public String getFriendName() { return friendName; }
    public void setFriendName(String friendName) { this.friendName = friendName; }

    public List<CartProductDTO> getCartProducts() { return cartProducts; }
    public void setCartProducts(List<CartProductDTO> cartProducts) { this.cartProducts = cartProducts; }
}