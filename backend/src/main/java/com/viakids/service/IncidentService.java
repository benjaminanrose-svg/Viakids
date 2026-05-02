package com.viakids.service;

import com.viakids.dto.IncidentDto;
import com.viakids.model.Incident;
import com.viakids.model.Route;
import com.viakids.model.User;
import com.viakids.repository.IncidentRepository;
import com.viakids.repository.RouteRepository;
import com.viakids.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;
    private final RouteRepository routeRepository;

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    public List<Incident> getIncidentsByConductor(Long conductorId) {
        return incidentRepository.findByConductorId(conductorId);
    }

    public List<Incident> getIncidentsByRoute(Long routeId) {
        return incidentRepository.findByRouteId(routeId);
    }

    public Incident getIncidentById(Long id) {
        return incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found: " + id));
    }

    @Transactional
    public Incident createIncident(IncidentDto dto, Long conductorId) {
        User conductor = userRepository.findById(conductorId)
                .orElseThrow(() -> new RuntimeException("Conductor not found: " + conductorId));

        Route route = null;
        if (dto.getRouteId() != null) {
            route = routeRepository.findById(dto.getRouteId()).orElse(null);
        }

        Incident incident = Incident.builder()
                .conductor(conductor)
                .route(route)
                .description(dto.getDescription())
                .severity(dto.getSeverity())
                .timestamp(LocalDateTime.now())
                .build();

        Incident saved = incidentRepository.save(incident);
        log.info("Incident reported by conductor {} - severity: {}", conductor.getName(), dto.getSeverity());
        return saved;
    }

    @Transactional
    public void deleteIncident(Long id) {
        incidentRepository.deleteById(id);
    }
}
