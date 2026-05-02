package com.viakids.repository;

import com.viakids.model.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByConductorId(Long conductorId);
    List<Incident> findByRouteId(Long routeId);
}
