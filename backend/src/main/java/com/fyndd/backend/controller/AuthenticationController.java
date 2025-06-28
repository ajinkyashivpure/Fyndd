package com.fyndd.backend.controller;

import com.fyndd.backend.config.JwtTokenProvider;
import com.fyndd.backend.model.LoginRequest;
import com.fyndd.backend.model.ResetPasswordRequest;
import com.fyndd.backend.model.SignupRequest;
import com.fyndd.backend.model.User;
import com.fyndd.backend.repository.UserRepository;
import com.fyndd.backend.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("auth/user")
public class AuthenticationController {

    private final HashMap<String, String> otpStore = new HashMap<>();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtTokenProvider jwtTokenProvider;
    public AuthenticationController(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        // Check if email already exists
        if (userRepository.findByEmail(signupRequest.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists");
        }

        if (userRepository.findByName(signupRequest.getName()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Name already taken");
        }



        String email = signupRequest.getEmail();
        // Generate and send OTP
        String otp = String.valueOf((int) (Math.random() * 9000) + 1000);
        otpStore.put(email, otp);
        emailService.sendOtpEmail(email, otp);
        System.out.println(otp);

        // Store signup data temporarily
        otpStore.put(email + "_data",
                signupRequest.getName() + "," + passwordEncoder.encode(signupRequest.getPassword()));

        return ResponseEntity.ok("OTP sent to " + email);
    }


    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        String storedOtp = otpStore.get(email);

        if (storedOtp == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No OTP found for this email or OTP expired");
        }

        if (!storedOtp.equals(otp)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid OTP");
        }

        // Get signup data
        String signupData = otpStore.get(email + "_data");
        if (signupData == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Signup data not found");
        }

        // Parse name and password
        String[] parts = signupData.split(",");
        if (parts.length != 2) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Invalid signup data");
        }

        String name = parts[0];
        String encodedPassword = parts[1];

        // Create and save user
        User user = new User();
        user.setEmail(email);
        user.setName(name);
        user.setPassword(encodedPassword);
        userRepository.save(user);

        // Clean up temporary OTP and signup data
        otpStore.remove(email);
        otpStore.remove(email + "_data");

        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail());
        if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email or password");
        }

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities("ROLE_USER")
                .build();

        String token = jwtTokenProvider.generateToken(userDetails);

        // Return user information with JWT token for frontend routing
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);


        // Add group information for student users

        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        // Check if user exists
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("No account found with this email address");
        }



        // Generate and send OTP for password reset
        String resetOtp = String.valueOf((int) (Math.random() * 9000) + 1000);
        otpStore.put(email + "_reset_otp", resetOtp);

        // Send reset OTP email
        emailService.sendResetOtpEmail(email, resetOtp);

        return ResponseEntity.ok("Password reset OTP sent to " + email);
    }

    @PostMapping("/verify-reset-otp")
    public ResponseEntity<?> verifyResetOtp(@RequestParam String email, @RequestParam String otp) {
        String storedOtp = otpStore.get(email + "_reset_otp");

        if (storedOtp == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("No reset request found for this email");
        }

        if (!storedOtp.equals(otp)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid or expired OTP");
        }

        // OTP is valid, remove it and generate reset token
        otpStore.remove(email + "_reset_otp");

        // Generate a secure reset token (UUID)
        String resetToken = java.util.UUID.randomUUID().toString();

        // Store reset token with timestamp for expiration (15 minutes)
        long expirationTime = System.currentTimeMillis() + (15 * 60 * 1000); // 15 minutes
        otpStore.put(email + "_reset_token", resetToken + "," + expirationTime);

        // Return the reset token
        Map<String, Object> response = new HashMap<>();
        response.put("resetToken", resetToken);
        response.put("message", "OTP verified successfully. You can now reset your password.");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {
        String email = resetPasswordRequest.getEmail();
        String resetToken = resetPasswordRequest.getResetToken();
        String newPassword = resetPasswordRequest.getNewPassword();

        // Validate input
        if (email == null || resetToken == null || newPassword == null ||
                email.trim().isEmpty() || resetToken.trim().isEmpty() || newPassword.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Email, reset token, and new password are required");
        }

        // Check if user exists
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid reset request");
        }

        // Retrieve and validate reset token
        String storedTokenData = otpStore.get(email + "_reset_token");
        if (storedTokenData == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid or expired reset token");
        }

        String[] tokenParts = storedTokenData.split(",");
        if (tokenParts.length != 2) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid reset token format");
        }

        String storedToken = tokenParts[0];
        long expirationTime = Long.parseLong(tokenParts[1]);

        // Check if token matches
        if (!storedToken.equals(resetToken)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid reset token");
        }

        // Check if token has expired
        if (System.currentTimeMillis() > expirationTime) {
            otpStore.remove(email + "_reset_token");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Reset token has expired. Please request a new password reset.");
        }

        // Validate new password (add your password strength validation here if needed)
        if (newPassword.length() < 6) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Password must be at least 6 characters long");
        }

        // Update user password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Remove reset token from storage
        otpStore.remove(email + "_reset_token");

        return ResponseEntity.ok("Password reset successfully. You can now login with your new password.");
    }



}
