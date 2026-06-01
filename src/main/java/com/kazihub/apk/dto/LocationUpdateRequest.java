package com.kazihub.apk.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LocationUpdateRequest {
    private Double locationLat;
    private Double locationLng;
}
