package com.kazihub.apk.repository;

import com.kazihub.apk.model.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WardRepository extends JpaRepository<Ward, Long> {
    List<Ward> findByDistrictIdOrderByNameAsc(Long districtId);
    List<Ward> findByDistrictNameOrderByNameAsc(String districtName);
}
