package com.kazihub.apk.repository;

import com.kazihub.apk.model.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegionRepository extends JpaRepository<Region, Long> {
    Optional<Region> findByName(String name);
    List<Region> findAllByOrderByNameAsc();
}
