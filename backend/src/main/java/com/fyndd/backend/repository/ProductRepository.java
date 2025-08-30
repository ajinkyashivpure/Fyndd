package com.fyndd.backend.repository;


import com.fyndd.backend.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    List<Product> findByType(String type);
    List<Product> findByCategoriesContainingAndTitleIsNotNull(String category);
    List<Product> findByBrandAndTitleIsNotNull(String brand);
}