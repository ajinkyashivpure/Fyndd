package com.fyndd.backend.repository;

import com.fyndd.backend.model.Friendship;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendshipRepository extends MongoRepository<Friendship, String> {
    void deleteByUserId1AndUserId2(String userId1, String userId2);
    void deleteByUserId2AndUserId1(String userId2, String userId1);

    @Query(value = "{ '$or': [ { 'userId1': ?0, 'userId2': ?1 }, { 'userId1': ?1, 'userId2': ?0 } ] }", delete = true)
    void deleteFriendship(String userId1, String userId2);

    List<Friendship> findByUserId1OrUserId2(String userId1, String userId2);
    boolean existsByUserId1AndUserId2OrUserId2AndUserId1(String userId1, String userId2, String userId2Alt, String userId1Alt);
    void deleteByUserId1AndUserId2OrUserId2AndUserId1(String userId1, String userId2, String userId2Alt, String userId1Alt);

}