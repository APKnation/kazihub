package com.kazihub.apk.controller;

import com.kazihub.apk.model.Job;
import com.kazihub.apk.model.JobApplication;
import com.kazihub.apk.model.JobStatus;
import com.kazihub.apk.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        return ResponseEntity.ok(jobService.createJob(job));
    }

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return jobService.getJobById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/employer/{employerId}")
    public ResponseEntity<List<Job>> getJobsByEmployer(@PathVariable Long employerId) {
        return ResponseEntity.ok(jobService.getJobsByEmployer(employerId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Job>> getJobsByStatus(@PathVariable JobStatus status) {
        return ResponseEntity.ok(jobService.getJobsByStatus(status));
    }

    @PostMapping("/{jobId}/apply")
    public ResponseEntity<JobApplication> applyForJob(@PathVariable Long jobId, @RequestBody JobApplication application) {
        // Here we ideally should set the job to the application
        // But assuming the client passes the proper IDs or JSON structure
        return ResponseEntity.ok(jobService.applyForJob(application));
    }

    @GetMapping("/{jobId}/applications")
    public ResponseEntity<List<JobApplication>> getApplicationsForJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(jobService.getApplicationsForJob(jobId));
    }

    @GetMapping("/applications/applicant/{applicantId}")
    public ResponseEntity<List<JobApplication>> getApplicationsByApplicant(@PathVariable Long applicantId) {
        return ResponseEntity.ok(jobService.getApplicationsByApplicant(applicantId));
    }
}
