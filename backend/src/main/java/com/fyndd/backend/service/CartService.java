package com.fyndd.backend.service;


import com.fyndd.backend.model.*;
import com.fyndd.backend.repository.CartRepository;
import com.fyndd.backend.repository.ProductRepository;
import com.fyndd.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository, ProductService productService, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.productService = productService;
        this.userRepository = userRepository;
    }

//    public Cart addToCart(String userId, String productId) {
//        Cart cart = cartRepository.findByUserId(userId).orElse(new Cart(userId));
//        cart.getProductIds().add(productId);
//        return cartRepository.save(cart);
//    }

//    public Cart getCart(String userId) {
//        return cartRepository.findByUserId(userId).orElse(new Cart(userId));
//    }


    public Cart createCart(String userId, String name, CartVisibility visibility) {
        Cart cart = new Cart(userId, name, visibility);
        return cartRepository.save(cart);
    }
    private Cart getUserCart(String userId, String cartId) {
        return cartRepository.findById(cartId)
                .filter(cart -> cart.getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Cart not found or unauthorized"));
    }

    public Cart addToCart(String userId, String cartId, String productId) {
        Cart cart = getUserCart(userId, cartId);
        cart.addProductId(productId);
        return cartRepository.save(cart);
    }

    public List<CartProductDTO> getCartProducts(String userId, String cartId) {
        Cart cart = getUserCart(userId, cartId);
        List<CartProductDTO> cartProducts = new ArrayList<>();

        for (String productId : cart.getProductIds()) {
            Product product = productService.getProductById(productId);
            if (product != null) {
                CartProductDTO dto = new CartProductDTO();
                dto.setId(productId);
                dto.setCartId(cart.getId());
                dto.setCartName(cart.getName());
                dto.setUrl(product.getUrl());
                dto.setCartVisibility(cart.getCartVisibility());
                dto.setTitle(product.getTitle());
                dto.setPrice(product.getPrice());
                dto.setImageUrl(product.getImageUrl());
                cartProducts.add(dto);
            }
        }

        return cartProducts;
    }

    public void deleteCart(String userId, String cartId) {
        Cart cart = getUserCart(userId, cartId);
        cartRepository.delete(cart);
    }

    public Cart removeFromCart(String userId, String cartId, String productId) {
        Cart cart = getUserCart(userId, cartId);
        cart.removeProductId(productId);
        return cartRepository.save(cart);
    }

    /**
     * Clear all products in a specific cart.
     */
    public void clearCart(String userId, String cartId) {
        Cart cart = getUserCart(userId, cartId);
        cart.clearProducts();
        cartRepository.save(cart);
    }

    public List<Cart> getUserCartsByVisibility(String userId, CartVisibility visibility) {
        return cartRepository.findByUserIdAndCartVisibility(userId, visibility);
    }

    public UserCartsDTO getUserCartsWithProducts(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        List<Cart> carts = cartRepository.findByUserId(userId);
        List<CartDetailsDTO> cartDetailsList = new ArrayList<>();

        for (Cart cart : carts) {
            List<CartProductDTO> products = getCartProducts(userId, cart.getId());

            CartDetailsDTO cartDTO = new CartDetailsDTO();
            cartDTO.setCartId(cart.getId());
            cartDTO.setCartName(cart.getName());
            cartDTO.setCartVisibility(cart.getCartVisibility().toString());
            cartDTO.setProducts(products);

            cartDetailsList.add(cartDTO);
        }

        UserCartsDTO userCartsDTO = new UserCartsDTO();
        userCartsDTO.setUserId(userId);
        userCartsDTO.setUserName(user.getName());
        userCartsDTO.setCarts(cartDetailsList);

        return userCartsDTO;
    }





}