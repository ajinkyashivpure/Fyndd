package com.fyndd.backend.repository;

import com.fyndd.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
    Optional<User> findByName(String name);

    User getById(String id);

    @Query("{ 'profile.bodyType': ?0 }")
    List<User> findByBodyType(String bodyType);
}
