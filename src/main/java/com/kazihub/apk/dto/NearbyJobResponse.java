package com.kazihub.apk.dto;

import com.kazihub.apk.model.Job;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NearbyJobResponse {
    private Job job;
    private double distanceInKm;
}
