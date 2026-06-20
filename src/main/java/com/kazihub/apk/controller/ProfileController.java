package com.kazihub.apk.controller;

import com.kazihub.apk.model.EmployerProfile;
import com.kazihub.apk.model.JobSeekerProfile;
import com.kazihub.apk.service.ProfileService;
import com.kazihub.apk.model.User;
import com.kazihub.apk.repository.UserRepository;
import com.kazihub.apk.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;

    @PostMapping("/job-seeker")
    public ResponseEntity<JobSeekerProfile> saveJobSeekerProfile(@RequestBody JobSeekerProfile profile) {
        return ResponseEntity.ok(profileService.saveJobSeekerProfile(profile));
    }

    @GetMapping("/job-seeker/me")
    public ResponseEntity<JobSeekerProfile> getMyJobSeekerProfile() {
        return ResponseEntity.ok(profileService.getMyJobSeekerProfile());
    }

    @PutMapping("/job-seeker/me")
    public ResponseEntity<JobSeekerProfile> updateMyJobSeekerProfile(@RequestBody JobSeekerProfile profile) {
        return ResponseEntity.ok(profileService.updateMyJobSeekerProfile(profile));
    }

    @GetMapping("/job-seeker/{userId}")
    public ResponseEntity<JobSeekerProfile> getJobSeekerProfile(@PathVariable Long userId) {
        return profileService.getJobSeekerProfile(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/employer")
    public ResponseEntity<EmployerProfile> saveEmployerProfile(@RequestBody EmployerProfile profile) {
        return ResponseEntity.ok(profileService.saveEmployerProfile(profile));
    }

    @GetMapping("/employer/{userId}")
    public ResponseEntity<EmployerProfile> getEmployerProfile(@PathVariable Long userId) {
        return profileService.getEmployerProfile(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/me/avatar")
    public ResponseEntity<?> uploadAvatar(@AuthenticationPrincipal User user, @RequestParam("file") MultipartFile file) {
        String fileUrl = fileStorageService.storeFile(file);
        user.setProfileImageUrl(fileUrl);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("profileImageUrl", fileUrl));
    }
}
