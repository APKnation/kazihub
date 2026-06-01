package com.kazihub.apk.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponse {
    private Long id;
    private Integer rating;
    private String comment;
    private String reviewerName;
    private Long reviewerId;
    private Long jobId;
    private LocalDateTime createdAt;
}
