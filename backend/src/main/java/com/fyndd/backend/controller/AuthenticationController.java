package com.fyndd.backend.controller;

import com.fyndd.backend.model.SignupRequest;
import com.fyndd.backend.repository.UserRepository;
import com.fyndd.backend.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@RequestMapping("auth/user")
public class AuthenticationController {

    private final HashMap<String, String> otpStore = new HashMap<>();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    public AuthenticationController(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
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
}
