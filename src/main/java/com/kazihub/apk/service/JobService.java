package com.kazihub.apk.service;

import com.kazihub.apk.model.Job;
import com.kazihub.apk.model.JobApplication;
import com.kazihub.apk.model.JobStatus;
import com.kazihub.apk.model.ApplicationStatus;
import com.kazihub.apk.model.User;
import com.kazihub.apk.repository.JobApplicationRepository;
import com.kazihub.apk.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Comparator;
import java.util.stream.Collectors;
import com.kazihub.apk.dto.NearbyJobResponse;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final LocationService locationService;

    public Job createJob(Job job) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User currentUser = (User) authentication.getPrincipal();
            job.setEmployer(currentUser);
        }
        return jobRepository.save(job);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public List<Job> getJobsByEmployer(Long employerId) {
        return jobRepository.findByEmployerId(employerId);
    }

    public List<Job> getJobsByStatus(JobStatus status) {
        return jobRepository.findByStatus(status);
    }

    public List<NearbyJobResponse> getNearbyJobs(double lat, double lng, double radiusKm) {
        return jobRepository.findByStatus(JobStatus.OPEN).stream()
                .filter(job -> job.getLocationLat() != null && job.getLocationLng() != null)
                .map(job -> {
                    double distance = locationService.calculateDistance(lat, lng, job.getLocationLat(), job.getLocationLng());
                    return new NearbyJobResponse(job, distance);
                })
                .filter(response -> response.getDistanceInKm() <= radiusKm)
                .sorted(Comparator.comparingDouble(NearbyJobResponse::getDistanceInKm))
                .collect(Collectors.toList());
    }

    public Optional<Job> getJobById(Long id) {
        return jobRepository.findById(id);
    }

    public JobApplication applyForJob(Long jobId, JobApplication application) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User currentUser = (User) authentication.getPrincipal();
            application.setApplicant(currentUser);
        } else {
            throw new RuntimeException("User not authenticated");
        }
        
        application.setJob(job);
        return jobApplicationRepository.save(application);
    }

    public List<JobApplication> getApplicationsForJob(Long jobId) {
        return jobApplicationRepository.findByJobId(jobId);
    }

    public List<JobApplication> getApplicationsByApplicant(Long applicantId) {
        return jobApplicationRepository.findByApplicantId(applicantId);
    }

    public List<Job> getPostedJobs() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User currentUser = (User) authentication.getPrincipal();
            return jobRepository.findByEmployerId(currentUser.getId());
        }
        return jobRepository.findAll();
    }

    public List<JobApplication> getMyApplications() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User currentUser = (User) authentication.getPrincipal();
            return jobApplicationRepository.findByApplicantId(currentUser.getId());
        }
        return jobApplicationRepository.findAll();
    }

    public JobApplication updateApplicationStatus(Long appId, ApplicationStatus status) {
        JobApplication application = jobApplicationRepository.findById(appId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User currentUser = (User) authentication.getPrincipal();
            boolean isAdmin = currentUser.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (!isAdmin && !application.getJob().getEmployer().getId().equals(currentUser.getId())) {
                throw new RuntimeException("Not authorized to update this application");
            }
        }
        
        application.setStatus(status);
        return jobApplicationRepository.save(application);
    }

    public Job updateJob(Long id, Job updated) {
        Job existing = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User currentUser = (User) authentication.getPrincipal();
            boolean isAdmin = currentUser.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (!isAdmin && !existing.getEmployer().getId().equals(currentUser.getId())) {
                throw new RuntimeException("Not authorized to update this job");
            }
        }

        if (updated.getTitle() != null)         existing.setTitle(updated.getTitle());
        if (updated.getDescription() != null)   existing.setDescription(updated.getDescription());
        if (updated.getLocation() != null)      existing.setLocation(updated.getLocation());
        if (updated.getPaymentAmount() != null) existing.setPaymentAmount(updated.getPaymentAmount());
        if (updated.getDuration() != null)      existing.setDuration(updated.getDuration());
        if (updated.getStatus() != null)        existing.setStatus(updated.getStatus());
        if (updated.getLocationLat() != null)   existing.setLocationLat(updated.getLocationLat());
        if (updated.getLocationLng() != null)   existing.setLocationLng(updated.getLocationLng());

        return jobRepository.save(existing);
    }

    public void deleteJob(Long id) {
        Job existing = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User currentUser = (User) authentication.getPrincipal();
            boolean isAdmin = currentUser.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (!isAdmin && !existing.getEmployer().getId().equals(currentUser.getId())) {
                throw new RuntimeException("Not authorized to delete this job");
            }
        }

        jobApplicationRepository.deleteByJobId(id);
        jobRepository.deleteById(id);
    }
}
