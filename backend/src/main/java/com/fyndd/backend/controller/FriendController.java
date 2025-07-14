package com.fyndd.backend.controller;

import com.fyndd.backend.model.FriendRequestDTO;
import com.fyndd.backend.model.UserSearchDTO;
import com.fyndd.backend.service.FriendService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
public class FriendController {

    private final  FriendService friendService;

    public FriendController(FriendService friendService) {
        this.friendService = friendService;
    }

    // Search users
    @GetMapping("/search")
    public ResponseEntity<List<UserSearchDTO>> searchUsers(@RequestParam String query) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<UserSearchDTO> users = friendService.searchUsers(currentUserId, query);
        return ResponseEntity.ok(users);
    }

    // Send friend request
    @PostMapping("/request/{receiverId}")
    public ResponseEntity<FriendRequestDTO> sendFriendRequest(@PathVariable String receiverId) {
        String senderId = SecurityContextHolder.getContext().getAuthentication().getName();
        FriendRequestDTO request = friendService.sendFriendRequest(senderId, receiverId);
        return ResponseEntity.ok(request);
    }

    // Accept friend request
    @PostMapping("/accept/{requestId}")
    public ResponseEntity<Void> acceptFriendRequest(@PathVariable String requestId) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        friendService.acceptFriendRequest(requestId, currentUserId);
        return ResponseEntity.ok().build();
    }

    // Reject friend request
    @PostMapping("/reject/{requestId}")
    public ResponseEntity<Void> rejectFriendRequest(@PathVariable String requestId) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        friendService.rejectFriendRequest(requestId, currentUserId);
        return ResponseEntity.ok().build();
    }

    // Get pending friend requests
    @GetMapping("/requests")
    public ResponseEntity<List<FriendRequestDTO>> getPendingRequests() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<FriendRequestDTO> requests = friendService.getPendingRequests(userId);
        return ResponseEntity.ok(requests);
    }

    // Remove friend
    @DeleteMapping("/{friendId}")
    public ResponseEntity<Void> removeFriend(@PathVariable String friendId) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        friendService.removeFriend(currentUserId, friendId);
        return ResponseEntity.ok().build();
    }
}