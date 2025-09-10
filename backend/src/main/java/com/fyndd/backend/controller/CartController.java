package com.fyndd.backend.controller;

import com.fyndd.backend.model.*;
import com.fyndd.backend.repository.UserRepository;
import com.fyndd.backend.service.CartService;
import com.fyndd.backend.service.FriendService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;
    private final FriendService friendService;
    private final UserRepository userRepository;

    public CartController(CartService cartService, FriendService friendService, UserRepository userRepository) {
        this.cartService = cartService;
        this.friendService = friendService;
        this.userRepository = userRepository;
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<Cart> addToCart(
            @PathVariable String productId,
            @RequestParam(defaultValue = "private") String cartType) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Cart add request by userId: " + userId + " to cart: " + cartType);

        CartType type = CartType.fromString(cartType);
        Cart updatedCart = cartService.addToCart(userId, productId, type);
        return ResponseEntity.ok(updatedCart);
    }

    @GetMapping
    public ResponseEntity<List<CartProductDTO>> getCart(@RequestParam(defaultValue = "private") String cartType) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        CartType type = CartType.fromString(cartType);
        List<CartProductDTO> cartProducts = cartService.getCartProducts(userId, type);
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

    @GetMapping("/public/{username}")
    public ResponseEntity<PublicCartDTO> getPublicCart(@PathVariable String username) {
        // Get user by username
        Optional<User> user = userRepository.findByName(username);
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<CartProductDTO> publicCartProducts = cartService.getCartProducts(user.get().getId(), CartType.PUBLIC);
        PublicCartDTO publicCart = new PublicCartDTO(user.get().getId(), username, publicCartProducts);
        return ResponseEntity.ok(publicCart);
    }
}
