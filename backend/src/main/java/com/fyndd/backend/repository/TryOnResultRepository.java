package com.fyndd.backend.repository;

import com.fyndd.backend.model.TryOnResult;
import com.fyndd.backend.model.TryOnStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TryOnResultRepository extends MongoRepository<TryOnResult, String> {
    List<TryOnResult> findByUserId(String userId);

    List<TryOnResult> findByUserIdAndStatus(String userId, TryOnStatus status);

    @Query("{ 'userId': ?0, 'createdAt': { $gte: ?1 } }")
    List<TryOnResult> findRecentByUserId(String userId, LocalDateTime since);

    long countByUserIdAndStatus(String userId, TryOnStatus status);
}
