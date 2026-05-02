package com.viakids.repository;

import com.viakids.model.GpsLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GpsLocationRepository extends JpaRepository<GpsLocation, Long> {
    Optional<GpsLocation> findTopByConductorIdOrderByTimestampDesc(Long conductorId);
}
