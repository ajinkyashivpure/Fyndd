package com.fyndd.backend.repository;

import com.fyndd.backend.model.StyleFeedback;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StyleFeedbackRepository extends MongoRepository<StyleFeedback, String> {
    Optional<StyleFeedback> findByTryonResultId(String tryonResultId);

    List<StyleFeedback> findByUserId(String userId);

    @Query("{ 'userId': ?0, 'styleScore': { $gte: ?1 } }")
    List<StyleFeedback> findHighScoringFeedback(String userId, double minScore);
}