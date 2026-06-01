package com.kazihub.apk.repository;

import com.kazihub.apk.model.Job;
import com.kazihub.apk.model.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByEmployerId(Long employerId);
    List<Job> findByStatus(JobStatus status);
    List<Job> findByRequiredSkillIdAndStatus(Long skillId, JobStatus status);
}
