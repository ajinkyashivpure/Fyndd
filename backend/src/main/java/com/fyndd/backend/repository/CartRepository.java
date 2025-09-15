package com.fyndd.backend.repository;

import com.fyndd.backend.model.Cart;
import com.fyndd.backend.model.CartVisibility;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends MongoRepository<Cart, String> {
    Optional<Cart> findByUserIdAndCartType(String userId, CartVisibility cartVisibility);
    List<Cart> findByUserId(String userId);
    void deleteByUserIdAndCartType(String userId, CartVisibility cartVisibility);

    List<Cart> findByUserIdAndCartVisibility(String userId, CartVisibility visibility);
}

