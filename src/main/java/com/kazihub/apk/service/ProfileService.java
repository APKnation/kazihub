package com.kazihub.apk.service;

import com.kazihub.apk.model.EmployerProfile;
import com.kazihub.apk.model.JobSeekerProfile;
import com.kazihub.apk.repository.EmployerProfileRepository;
import com.kazihub.apk.repository.JobSeekerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

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

    public EmployerProfile saveEmployerProfile(EmployerProfile profile) {
        return employerProfileRepository.save(profile);
    }

    public Optional<EmployerProfile> getEmployerProfile(Long userId) {
        return employerProfileRepository.findByUserId(userId);
    }
}
