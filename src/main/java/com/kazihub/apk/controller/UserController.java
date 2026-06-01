package com.kazihub.apk.controller;

import com.kazihub.apk.dto.LocationUpdateRequest;
import com.kazihub.apk.model.User;
import com.kazihub.apk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    /**
     * Called automatically when a user logs in from the mobile app.
     * Updates the user's current GPS coordinates in the database.
     */
    @PutMapping("/me/location")
    public ResponseEntity<String> updateLocation(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody LocationUpdateRequest request) {

        User user = userRepository.findByPhone(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setLocationLat(request.getLocationLat());
        user.setLocationLng(request.getLocationLng());
        userRepository.save(user);

        return ResponseEntity.ok("Location updated successfully");
    }

    /**
     * Returns the current authenticated user's profile including location.
     */
    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByPhone(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }
}
