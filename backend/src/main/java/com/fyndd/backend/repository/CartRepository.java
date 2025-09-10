package com.fyndd.backend.repository;

import com.fyndd.backend.model.Cart;
import com.fyndd.backend.model.CartType;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends MongoRepository<Cart, String> {
    Optional<Cart> findByUserIdAndCartType(String userId, CartType cartType);
    Optional<Cart> findByUserId(String userId);
    void deleteByUserIdAndCartType(String userId, CartType cartType);
}

