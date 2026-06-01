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

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;

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
