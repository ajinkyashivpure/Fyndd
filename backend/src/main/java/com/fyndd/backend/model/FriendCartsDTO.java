package com.fyndd.backend.model;

import java.util.List;

public class FriendCartsDTO {
    private String friendId;
    private String friendName;
    private List<FriendCartDetailsDTO> publicCarts;
    private List<FriendCartDetailsDTO> privateCarts;

    public String getFriendId() {
        return friendId;
    }

    public void setFriendId(String friendId) {
        this.friendId = friendId;
    }

    public String getFriendName() {
        return friendName;
    }

    public void setFriendName(String friendName) {
        this.friendName = friendName;
    }

    public List<FriendCartDetailsDTO> getPublicCarts() {
        return publicCarts;
    }

    public void setPublicCarts(List<FriendCartDetailsDTO> publicCarts) {
        this.publicCarts = publicCarts;
    }

    public List<FriendCartDetailsDTO> getPrivateCarts() {
        return privateCarts;
    }

    public void setPrivateCarts(List<FriendCartDetailsDTO> privateCarts) {
        this.privateCarts = privateCarts;
    }
}
