package com.viakids.repository;

import com.viakids.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByPlate(String plate);
    List<Vehicle> findByConductorId(Long conductorId);
    List<Vehicle> findByActiveTrue();
    boolean existsByPlate(String plate);
}
