package com.kazihub.apk.controller;

import com.kazihub.apk.model.EmployerProfile;
import com.kazihub.apk.model.JobSeekerProfile;
import com.kazihub.apk.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping("/job-seeker")
    public ResponseEntity<JobSeekerProfile> saveJobSeekerProfile(@RequestBody JobSeekerProfile profile) {
        return ResponseEntity.ok(profileService.saveJobSeekerProfile(profile));
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
}
