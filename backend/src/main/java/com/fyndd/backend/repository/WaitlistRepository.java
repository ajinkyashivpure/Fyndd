package com.fyndd.backend.repository;


import com.fyndd.backend.model.WaitlistUser;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface WaitlistRepository extends MongoRepository<WaitlistUser, String> {
    Optional<WaitlistUser> findByEmail(String email);
}