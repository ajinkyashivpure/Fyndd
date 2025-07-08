package com.fyndd.backend.service;


import com.fyndd.backend.model.Cart;
import com.fyndd.backend.model.CartProductDTO;
import com.fyndd.backend.repository.CartRepository;
import com.fyndd.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    public Cart addToCart(String userId, String productId) {
        Cart cart = cartRepository.findByUserId(userId).orElse(new Cart(userId));
        cart.getProductIds().add(productId);
        return cartRepository.save(cart);
    }

    public Cart getCart(String userId) {
        return cartRepository.findByUserId(userId).orElse(new Cart(userId));
    }

    public Cart removeFromCart(String userId, String productId) {
        Cart cart = cartRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Cart not found"));
        cart.getProductIds().removeIf(p -> p.equals(productId));
        return cartRepository.save(cart);
    }

    public void clearCart(String userId) {
        cartRepository.findByUserId(userId).ifPresent(cart -> {
            cart.getProductIds().clear();
            cartRepository.save(cart);
        });
    }

    public List<CartProductDTO> getCartProducts(String userId) {
        Cart cart = cartRepository.findByUserId(userId).orElse(new Cart(userId));
        List<String> productIds = cart.getProductIds();

        return productIds.stream()
                .map(productRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(product -> new CartProductDTO(
                        product.getId(),
                        product.getTitle(),
                        product.getPrice(),
                        product.getImageUrl(),
                        product.getUrl()
                ))
                .collect(Collectors.toList());
    }
}
