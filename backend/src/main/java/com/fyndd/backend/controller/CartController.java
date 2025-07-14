package com.fyndd.backend.controller;

import com.fyndd.backend.model.Cart;
import com.fyndd.backend.model.CartProductDTO;
import com.fyndd.backend.model.FriendCartDTO;
import com.fyndd.backend.service.CartService;
import com.fyndd.backend.service.FriendService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;
    private final FriendService friendService;

    public CartController(CartService cartService, FriendService friendService) {
        this.cartService = cartService;
        this.friendService = friendService;
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<Cart> addToCart(@PathVariable String productId) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Cart add request by userId: " + userId);
        Cart updatedCart = cartService.addToCart(userId, productId);
        return ResponseEntity.ok(updatedCart);
    }

    @GetMapping
    public ResponseEntity<List<CartProductDTO>> getCart() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<CartProductDTO> cartProducts = cartService.getCartProducts(userId);
        return ResponseEntity.ok(cartProducts);
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Cart> removeFromCart(@PathVariable String productId) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Cart updatedCart = cartService.removeFromCart(userId, productId);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<String> clearCart() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        cartService.clearCart(userId);
        return ResponseEntity.ok("Cart cleared successfully");
    }

    @GetMapping("/friends")
    public ResponseEntity<List<FriendCartDTO>> getFriendsCartsWithProducts() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<FriendCartDTO> friendCarts = friendService.getFriendsCartsWithProducts(userId);
        return ResponseEntity.ok(friendCarts);
    }
}
