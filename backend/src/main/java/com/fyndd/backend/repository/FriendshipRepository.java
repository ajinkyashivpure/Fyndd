package com.fyndd.backend.repository;

import com.fyndd.backend.model.Friendship;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendshipRepository extends MongoRepository<Friendship, String> {
    List<Friendship> findByUserId1OrUserId2(String userId1, String userId2);
    boolean existsByUserId1AndUserId2OrUserId2AndUserId1(String userId1, String userId2, String userId2Alt, String userId1Alt);
    void deleteByUserId1AndUserId2OrUserId2AndUserId1(String userId1, String userId2, String userId2Alt, String userId1Alt);
}