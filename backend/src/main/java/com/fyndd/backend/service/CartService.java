package com.fyndd.backend.service;


import com.fyndd.backend.model.Cart;
import com.fyndd.backend.model.CartProductDTO;
import com.fyndd.backend.model.CartType;
import com.fyndd.backend.model.Product;
import com.fyndd.backend.repository.CartRepository;
import com.fyndd.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService implements CartServiceInterface {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;

    public CartService(CartRepository cartRepository, ProductRepository productRepository, ProductService productService) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.productService = productService;
    }

//    public Cart addToCart(String userId, String productId) {
//        Cart cart = cartRepository.findByUserId(userId).orElse(new Cart(userId));
//        cart.getProductIds().add(productId);
//        return cartRepository.save(cart);
//    }

//    public Cart getCart(String userId) {
//        return cartRepository.findByUserId(userId).orElse(new Cart(userId));
//    }

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

//    public List<CartProductDTO> getCartProducts(String userId) {
//        Cart cart = cartRepository.findByUserId(userId).orElse(new Cart(userId));
//        List<String> productIds = cart.getProductIds();
//
//        return productIds.stream()
//                .map(productRepository::findById)
//                .filter(Optional::isPresent)
//                .map(Optional::get)
//                .map(product -> new CartProductDTO(
//                        product.getId(),
//                        product.getTitle(),
//                        product.getPrice(),
//                        product.getImageUrl(),
//                        product.getUrl()
//                ))
//                .collect(Collectors.toList());
//    }


    //interface methods

    @Override
    public Cart getOrCreateCart(String userId, CartType cartType) {
        return cartRepository.findByUserIdAndCartType(userId, cartType)
                .orElseGet(() -> {
                    Cart newCart = new Cart(userId, cartType);
                    return cartRepository.save(newCart);
                });
    }

    @Override
    public Cart addToCart(String userId, String productId, CartType cartType) {
        Cart cart = getOrCreateCart(userId, cartType);
        cart.addProductId(productId);
        return cartRepository.save(cart);
    }

    @Override
    public Cart removeFromCart(String userId, String productId, CartType cartType) {
        Cart cart = getOrCreateCart(userId, cartType);
        cart.removeProductId(productId);
        return cartRepository.save(cart);
    }

    @Override
    public void clearCart(String userId, CartType cartType) {
        Cart cart = getOrCreateCart(userId, cartType);
        cart.clearProducts();
        cartRepository.save(cart);
    }

    @Override
    public List<CartProductDTO> getCartProducts(String userId, CartType cartType) {
        Cart cart = getOrCreateCart(userId, cartType);
        List<CartProductDTO> cartProducts = new ArrayList<>();

        for (String productId : cart.getProductIds()) {
            // Assuming you have a method to get product details
            Product product = productService.getProductById(productId);
            if (product != null) {
                CartProductDTO cartProduct = new CartProductDTO();
                cartProduct.setId(productId);
                cartProduct.setCartType(cartType);
                // Set other product details
                cartProduct.setTitle(product.getTitle());
                cartProduct.setPrice(product.getPrice());
                cartProduct.setImageUrl(product.getImageUrl());
                
                // Add other fields as needed
                cartProducts.add(cartProduct);
            }
        }

        return cartProducts;
    }

    @Override
    public List<CartProductDTO> getAllUserCarts(String userId) {
        List<CartProductDTO> allCartProducts = new ArrayList<>();

        for (CartType cartType : CartType.values()) {
            List<CartProductDTO> cartProducts = getCartProducts(userId, cartType);
            allCartProducts.addAll(cartProducts);
        }

        return allCartProducts;
    }
}