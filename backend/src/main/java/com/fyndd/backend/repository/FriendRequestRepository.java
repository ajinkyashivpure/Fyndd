package com.fyndd.backend.repository;

import com.fyndd.backend.model.FriendRequest;
import com.fyndd.backend.model.FriendRequestStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends MongoRepository<FriendRequest, String> {
    List<FriendRequest> findByReceiverIdAndStatus(String receiverId, FriendRequestStatus status);
    List<FriendRequest> findBySenderIdAndStatus(String senderId, FriendRequestStatus status);
    Optional<FriendRequest> findBySenderIdAndReceiverId(String senderId, String receiverId);
    Optional<FriendRequest> findBySenderIdAndReceiverIdAndStatus(String senderId, String receiverId, FriendRequestStatus status);
    boolean existsBySenderIdAndReceiverIdAndStatus(String senderId, String receiverId, FriendRequestStatus status);
}