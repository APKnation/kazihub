package com.kazihub.apk.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String name;
    private String phone;
    private String email;
    private String password;
    private Double locationLat;
    private Double locationLng;
    private String region;   // Tanzania Region (e.g. Dar es Salaam)
    private String district; // Tanzania District (e.g. Ilala)
    private String ward;     // Tanzania Ward (e.g. Gerezani)
    private String role; // e.g. "JOB_SEEKER", "EMPLOYER"
}
