package com.kazihub.apk.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Integer rating;
    private String comment;
    private Long revieweeId;
    private Long jobId;
}
