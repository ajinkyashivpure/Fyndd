package com.fyndd.backend.service;

import com.fyndd.backend.model.Cart;
import com.fyndd.backend.model.CartProductDTO;
import com.fyndd.backend.model.CartType;

import java.util.List;

public interface CartServiceInterface {
    Cart addToCart(String userId, String productId, CartType cartType);
    Cart removeFromCart(String userId, String productId, CartType cartType);
    void clearCart(String userId, CartType cartType);
    List<CartProductDTO> getCartProducts(String userId, CartType cartType);
    List<CartProductDTO> getAllUserCarts(String userId);
    Cart getOrCreateCart(String userId, CartType cartType);
}
