package com.fyndd.backend.controller;

import com.fyndd.backend.model.*;
import com.fyndd.backend.repository.UserRepository;
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
    private final UserRepository userRepository;

    public CartController(CartService cartService, FriendService friendService, UserRepository userRepository) {
        this.cartService = cartService;
        this.friendService = friendService;
        this.userRepository = userRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<Cart> createCart(
            @RequestParam String name,
            @RequestParam(defaultValue = "private") String visibility) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        CartVisibility vis = CartVisibility.fromString(visibility);
        Cart newCart = cartService.createCart(userId, name, vis);
        return ResponseEntity.ok(newCart);
    }

    @PostMapping("/{cartId}/add/{productId}")
    public ResponseEntity<Cart> addToCart(@PathVariable String cartId, @PathVariable String productId) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Cart updatedCart = cartService.addToCart(userId, cartId, productId);
        return ResponseEntity.ok(updatedCart);
    }

    @GetMapping("/{cartId}")
    public ResponseEntity<List<CartProductDTO>> getCart(@PathVariable String cartId) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<CartProductDTO> cartProducts = cartService.getCartProducts(userId, cartId);
        return ResponseEntity.ok(cartProducts);
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<String> deleteCart(@PathVariable String cartId) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        cartService.deleteCart(userId, cartId);
        return ResponseEntity.ok("Cart deleted successfully");
    }

    @DeleteMapping("/{cartId}/remove/{productId}")
    public ResponseEntity<Cart> removeFromCart(
            @PathVariable String cartId,
            @PathVariable String productId) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Cart updatedCart = cartService.removeFromCart(userId, cartId, productId);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/{cartId}/clear")
    public ResponseEntity<String> clearCart(@PathVariable String cartId) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        cartService.clearCart(userId, cartId);
        return ResponseEntity.ok("Cart cleared successfully");
    }

    @GetMapping("/visibility/{visibility}")
    public ResponseEntity<List<Cart>> getCartsByVisibility(@PathVariable String visibility) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        CartVisibility vis = CartVisibility.fromString(visibility);
        List<Cart> carts = cartService.getUserCartsByVisibility(userId, vis);
        return ResponseEntity.ok(carts);
    }

//    @PostMapping("/add/{productId}")
//    public ResponseEntity<Cart> addToCart(
//            @PathVariable String productId,
//            @RequestParam(defaultValue = "private") String cartType) {
//        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
//        System.out.println("Cart add request by userId: " + userId + " to cart: " + cartType);
//
//        CartVisibility type = CartVisibility.fromString(cartType);
//        Cart updatedCart = cartService.addToCart(userId, productId, type);
//        return ResponseEntity.ok(updatedCart);
//    }

    @GetMapping("/all")
    public ResponseEntity<UserCartsDTO> getAllCartsOfUser() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        UserCartsDTO userCarts = cartService.getUserCartsWithProducts(userId);
        return ResponseEntity.ok(userCarts);
    }





    @GetMapping("/friends")
    public ResponseEntity<List<FriendCartsDTO>> getFriendsCartsWithProducts() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<FriendCartsDTO> friendCarts = friendService.getFriendsCartsWithProducts(userId);
        return ResponseEntity.ok(friendCarts);
    }


}
