package com.fyndd.backend.controller;

import com.fyndd.backend.service.WaitlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/waitlist")
public class WaitlistController {


    private final  WaitlistService waitlistService;

    public WaitlistController(WaitlistService waitlistService) {
        this.waitlistService = waitlistService;
    }

    @PostMapping
    public ResponseEntity<String> joinWaitlist(@RequestParam String email) {
        String message = waitlistService.addToWaitlist(email);
        return ResponseEntity.ok(message);
    }
}