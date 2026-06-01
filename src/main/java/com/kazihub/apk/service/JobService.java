package com.kazihub.apk.service;

import com.kazihub.apk.model.Job;
import com.kazihub.apk.model.JobApplication;
import com.kazihub.apk.model.JobStatus;
import com.kazihub.apk.repository.JobApplicationRepository;
import com.kazihub.apk.repository.JobRepository;
import lombok.RequiredArgsConstructor;
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

    public JobApplication applyForJob(JobApplication application) {
        return jobApplicationRepository.save(application);
    }

    public List<JobApplication> getApplicationsForJob(Long jobId) {
        return jobApplicationRepository.findByJobId(jobId);
    }

    public List<JobApplication> getApplicationsByApplicant(Long applicantId) {
        return jobApplicationRepository.findByApplicantId(applicantId);
    }
}
