package com.fyndd.backend.service;

import com.fyndd.backend.model.WaitlistUser;
import com.fyndd.backend.repository.WaitlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WaitlistService {


    private final  WaitlistRepository waitlistRepository;

    public WaitlistService(WaitlistRepository waitlistRepository) {
        this.waitlistRepository = waitlistRepository;
    }

    public String addToWaitlist(String email) {
        if (waitlistRepository.findByEmail(email).isPresent()) {
            return "You’re already on the waitlist!";
        }

        WaitlistUser user = new WaitlistUser(email);
        waitlistRepository.save(user);
        return "Successfully joined the waitlist!";
    }
}
