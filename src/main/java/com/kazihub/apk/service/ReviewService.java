package com.kazihub.apk.service;

import com.kazihub.apk.dto.ReviewRequest;
import com.kazihub.apk.dto.ReviewResponse;
import com.kazihub.apk.model.Job;
import com.kazihub.apk.model.Review;
import com.kazihub.apk.model.User;
import com.kazihub.apk.repository.JobRepository;
import com.kazihub.apk.repository.ReviewRepository;
import com.kazihub.apk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    public ReviewResponse postReview(User reviewer, ReviewRequest request) {
        User reviewee = userRepository.findById(request.getRevieweeId())
                .orElseThrow(() -> new RuntimeException("Reviewee not found"));

        Job job = null;
        if (request.getJobId() != null) {
            job = jobRepository.findById(request.getJobId())
                    .orElseThrow(() -> new RuntimeException("Job not found"));
        }

        Review review = Review.builder()
                .rating(request.getRating())
                .comment(request.getComment())
                .reviewer(reviewer)
                .reviewee(reviewee)
                .job(job)
                .build();

        Review saved = reviewRepository.save(review);
        return mapToResponse(saved);
    }

    public List<ReviewResponse> getReviewsForUser(Long userId) {
        List<Review> reviews = reviewRepository.findByRevieweeId(userId);
        return reviews.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .reviewerId(review.getReviewer().getId())
                .reviewerName(review.getReviewer().getName())
                .jobId(review.getJob() != null ? review.getJob().getId() : null)
                .createdAt(review.getCreatedAt())
                .build();
    }
}
