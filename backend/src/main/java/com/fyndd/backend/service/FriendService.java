package com.fyndd.backend.service;

import com.fyndd.backend.model.*;
import com.fyndd.backend.repository.FriendRequestRepository;
import com.fyndd.backend.repository.FriendshipRepository;
import com.fyndd.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FriendService {

    private final  FriendRequestRepository friendRequestRepository;
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;
    private final CartService cartService;

    public FriendService(FriendRequestRepository friendRequestRepository, FriendshipRepository friendshipRepository, UserRepository userRepository, CartService cartService) {
        this.friendRequestRepository = friendRequestRepository;
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
        this.cartService = cartService;
    }

    // Search users by username
    public List<UserSearchDTO> searchUsers(String currentUserId, String searchTerm) {
        Optional<User> userOptional = userRepository.findByName(searchTerm);
        List<UserSearchDTO> result = new ArrayList<>();

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (!user.getId().equals(currentUserId)) {
                UserSearchDTO dto = new UserSearchDTO(user.getId(), user.getName(), user.getEmail());

                // Check if already friends
                boolean isFriend = friendshipRepository.existsByUserId1AndUserId2OrUserId2AndUserId1(
                        currentUserId, user.getId(), user.getId(), currentUserId);
                dto.setFriend(isFriend);

                if (!isFriend) {
                    // Check friend request status
                    Optional<FriendRequest> sentRequest = friendRequestRepository.findBySenderIdAndReceiverIdAndStatus(
                            currentUserId, user.getId(), FriendRequestStatus.PENDING);
                    Optional<FriendRequest> receivedRequest = friendRequestRepository.findBySenderIdAndReceiverIdAndStatus(
                            user.getId(), currentUserId, FriendRequestStatus.PENDING);

                    if (sentRequest.isPresent()) {
                        dto.setRequestStatus(FriendRequestStatus.PENDING);
                    } else if (receivedRequest.isPresent()) {
                        dto.setRequestStatus(FriendRequestStatus.PENDING);
                    }
                }

                result.add(dto);
            }
        }
        return result;
    }

    // Send friend request
    public FriendRequestDTO sendFriendRequest(String senderId, String receiverId) {
        // Check if already friends
        if (friendshipRepository.existsByUserId1AndUserId2OrUserId2AndUserId1(senderId, receiverId, receiverId, senderId)) {
            throw new IllegalStateException("Already friends");
        }

        // Check if request already exists
        if (friendRequestRepository.existsBySenderIdAndReceiverIdAndStatus(senderId, receiverId, FriendRequestStatus.PENDING) ||
                friendRequestRepository.existsBySenderIdAndReceiverIdAndStatus(receiverId, senderId, FriendRequestStatus.PENDING)) {
            throw new IllegalStateException("Friend request already exists");
        }

        FriendRequest request = new FriendRequest(senderId, receiverId);
        request = friendRequestRepository.save(request);

        return mapToDTO(request);
    }

    // Accept friend request
    public void acceptFriendRequest(String requestId, String currentUserId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Friend request not found"));

        if (!request.getReceiverId().equals(currentUserId)) {
            throw new IllegalStateException("Cannot accept this request");
        }

        if (request.getStatus() != FriendRequestStatus.PENDING) {
            throw new IllegalStateException("Request is not pending");
        }

        // Update request status
        request.setStatus(FriendRequestStatus.ACCEPTED);
        friendRequestRepository.save(request);

        // Create friendship
        Friendship friendship = new Friendship(request.getSenderId(), request.getReceiverId());
        friendshipRepository.save(friendship);
    }

    // Reject friend request
    public void rejectFriendRequest(String requestId, String currentUserId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Friend request not found"));

        if (!request.getReceiverId().equals(currentUserId)) {
            throw new IllegalStateException("Cannot reject this request");
        }

        request.setStatus(FriendRequestStatus.REJECTED);
        friendRequestRepository.save(request);
    }

    // Get pending friend requests
    public List<FriendRequestDTO> getPendingRequests(String userId) {
        List<FriendRequest> requests = friendRequestRepository.findByReceiverIdAndStatus(userId, FriendRequestStatus.PENDING);
        return requests.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // Get friends' carts
    public List<FriendCartDTO> getFriendsCartsWithProducts(String userId) {
        List<Friendship> friendships = friendshipRepository.findByUserId1OrUserId2(userId, userId);
        List<FriendCartDTO> friendCarts = new ArrayList<>();

        for (Friendship friendship : friendships) {
            String friendId = friendship.getUserId1().equals(userId) ?
                    friendship.getUserId2() : friendship.getUserId1();

            Optional<User> friend = userRepository.findById(friendId);
            if (friend.isPresent()) {
                List<CartProductDTO> cartProducts = cartService.getCartProducts(friendId, CartType.PRIVATE);
                friendCarts.add(new FriendCartDTO(friendId, friend.get().getName(), cartProducts));
            }
        }

        return friendCarts;
    }

    // Remove friend
    public void removeFriend(String currentUserId, String friendId) {
        friendshipRepository.deleteByUserId1AndUserId2OrUserId2AndUserId1(
                currentUserId, friendId, friendId, currentUserId);
    }

    // Helper method to map FriendRequest to DTO
    private FriendRequestDTO mapToDTO(FriendRequest request) {
        FriendRequestDTO dto = new FriendRequestDTO();
        dto.setId(request.getId());
        dto.setSenderId(request.getSenderId());
        dto.setReceiverId(request.getReceiverId());
        dto.setStatus(request.getStatus());
        dto.setCreatedAt(request.getCreatedAt());

        // Get sender and receiver names
        userRepository.findById(request.getSenderId()).ifPresent(user -> dto.setSenderName(user.getName()));
        userRepository.findById(request.getReceiverId()).ifPresent(user -> dto.setReceiverName(user.getName()));

        return dto;
    }
}