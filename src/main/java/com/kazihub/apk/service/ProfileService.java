package com.kazihub.apk.service;

import com.kazihub.apk.model.EmployerProfile;
import com.kazihub.apk.model.JobSeekerProfile;
import com.kazihub.apk.repository.EmployerProfileRepository;
import com.kazihub.apk.repository.JobSeekerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.kazihub.apk.model.User;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final EmployerProfileRepository employerProfileRepository;

    public JobSeekerProfile saveJobSeekerProfile(JobSeekerProfile profile) {
        return jobSeekerProfileRepository.save(profile);
    }

    public Optional<JobSeekerProfile> getJobSeekerProfile(Long userId) {
        return jobSeekerProfileRepository.findByUserId(userId);
    }

    public JobSeekerProfile getMyJobSeekerProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User currentUser = (User) authentication.getPrincipal();
            return jobSeekerProfileRepository.findByUserId(currentUser.getId())
                    .orElseGet(() -> {
                        JobSeekerProfile newProfile = new JobSeekerProfile();
                        newProfile.setUser(currentUser);
                        return jobSeekerProfileRepository.save(newProfile);
                    });
        }
        throw new RuntimeException("User not authenticated");
    }

    public JobSeekerProfile updateMyJobSeekerProfile(JobSeekerProfile updateRequest) {
        JobSeekerProfile currentProfile = getMyJobSeekerProfile();
        
        System.out.println("DEBUG Profile Update Request Received:");
        System.out.println("  Age: " + updateRequest.getAge());
        System.out.println("  Education Level: " + updateRequest.getEducationLevel());
        System.out.println("  Experience: " + updateRequest.getExperience());
        System.out.println("  Portfolio URL: " + updateRequest.getPortfolioUrl());
        System.out.println("  CV Text: " + (updateRequest.getCvText() != null ? (updateRequest.getCvText().length() + " chars") : "null"));
        
        currentProfile.setExperience(updateRequest.getExperience());
        currentProfile.setPortfolioUrl(updateRequest.getPortfolioUrl());
        currentProfile.setAge(updateRequest.getAge());
        currentProfile.setEducationLevel(updateRequest.getEducationLevel());
        currentProfile.setCvText(updateRequest.getCvText());
        
        JobSeekerProfile saved = jobSeekerProfileRepository.save(currentProfile);
        System.out.println("DEBUG Profile Saved: ID=" + saved.getId() + ", User=" + saved.getUser().getName());
        return saved;
    }

    public EmployerProfile saveEmployerProfile(EmployerProfile profile) {
        return employerProfileRepository.save(profile);
    }

    public Optional<EmployerProfile> getEmployerProfile(Long userId) {
        return employerProfileRepository.findByUserId(userId);
    }
}
