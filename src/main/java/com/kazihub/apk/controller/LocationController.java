package com.kazihub.apk.controller;

import com.kazihub.apk.dto.DistrictDto;
import com.kazihub.apk.dto.RegionDto;
import com.kazihub.apk.dto.WardDto;
import com.kazihub.apk.model.District;
import com.kazihub.apk.model.Region;
import com.kazihub.apk.model.Ward;
import com.kazihub.apk.repository.DistrictRepository;
import com.kazihub.apk.repository.RegionRepository;
import com.kazihub.apk.repository.WardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LocationController {

    private final RegionRepository regionRepository;
    private final DistrictRepository districtRepository;
    private final WardRepository wardRepository;

    @GetMapping("/regions")
    public List<RegionDto> getAllRegions() {
        return regionRepository.findAllByOrderByNameAsc().stream()
                .map(region -> RegionDto.builder()
                        .id(region.getId())
                        .name(region.getName())
                        .build())
                .toList();
    }

    @GetMapping("/districts")
    public List<DistrictDto> getDistrictsByRegion(@RequestParam Long regionId) {
        return districtRepository.findByRegionIdOrderByNameAsc(regionId).stream()
                .map(district -> DistrictDto.builder()
                        .id(district.getId())
                        .name(district.getName())
                        .regionId(district.getRegion().getId())
                        .build())
                .toList();
    }

    @GetMapping("/wards")
    public List<WardDto> getWardsByDistrict(@RequestParam Long districtId) {
        return wardRepository.findByDistrictIdOrderByNameAsc(districtId).stream()
                .map(ward -> WardDto.builder()
                        .id(ward.getId())
                        .name(ward.getName())
                        .districtId(ward.getDistrict().getId())
                        .build())
                .toList();
    }
}
