package com.fyndd.backend.service;

import com.fyndd.backend.model.Cart;
import com.fyndd.backend.model.CartProductDTO;
import com.fyndd.backend.model.CartVisibility;

import java.util.List;

public interface CartServiceInterface {
    Cart addToCart(String userId, String productId, CartVisibility cartVisibility);
    Cart removeFromCart(String userId, String productId, CartVisibility cartVisibility);
    void clearCart(String userId, CartVisibility cartVisibility);
    List<CartProductDTO> getCartProducts(String userId, CartVisibility cartVisibility);
    List<CartProductDTO> getAllUserCarts(String userId);
    Cart getOrCreateCart(String userId, CartVisibility cartVisibility);
}
