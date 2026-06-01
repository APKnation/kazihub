package com.kazihub.apk.controller;

import com.kazihub.apk.dto.ReviewRequest;
import com.kazihub.apk.dto.ReviewResponse;
import com.kazihub.apk.model.User;
import com.kazihub.apk.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponse> postReview(
            @AuthenticationPrincipal User reviewer,
            @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.postReview(reviewer, request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewResponse>> getUserReviews(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getReviewsForUser(userId));
    }
}
