package com.fyndd.backend.model;

public class UserSearchDTO {
    private String id;
    private String name;
    private String email;
    private boolean isFriend;
    private FriendRequestStatus requestStatus;

    // Constructors, getters, setters
    public UserSearchDTO() {}

    public UserSearchDTO(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public UserSearchDTO(String name , String email){
        this.name = name;
        this.email = email;
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public boolean isFriend() { return isFriend; }
    public void setFriend(boolean friend) { isFriend = friend; }

    public FriendRequestStatus getRequestStatus() { return requestStatus; }
    public void setRequestStatus(FriendRequestStatus requestStatus) { this.requestStatus = requestStatus; }
}