package com.fyndd.backend.repository;

import com.fyndd.backend.model.StyleRecommendation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface StyleRecommendationRepository extends MongoRepository<StyleRecommendation, String> {
    List<StyleRecommendation> findByUserId(String userId);

    @Query("{ 'userId': ?0, 'expiresAt': { $gte: ?1 } }")
    Optional<StyleRecommendation> findValidRecommendation(String userId, LocalDateTime now);

    void deleteByExpiresAtBefore(LocalDateTime date);
}