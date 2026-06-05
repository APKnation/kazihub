package com.kazihub.apk.repository;

import com.kazihub.apk.model.District;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DistrictRepository extends JpaRepository<District, Long> {
    List<District> findByRegionIdOrderBy_nameAsc(Long regionId);
    List<District> findByRegionNameOrderBy_nameAsc(String regionName);
}
