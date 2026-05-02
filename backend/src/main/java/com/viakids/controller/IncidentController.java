package com.viakids.controller;

import com.viakids.dto.IncidentDto;
import com.viakids.model.Incident;
import com.viakids.model.Route;
import com.viakids.model.User;
import com.viakids.repository.IncidentRepository;
import com.viakids.repository.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentRepository incidentRepository;
    private final RouteRepository routeRepository;

    @PostMapping
    public ResponseEntity<Incident> create(@RequestBody IncidentDto dto,
                                           @AuthenticationPrincipal User currentUser) {
        Route route = dto.getRouteId() != null
                ? routeRepository.findById(dto.getRouteId()).orElse(null)
                : null;
        Incident incident = Incident.builder()
                .conductor(currentUser)
                .route(route)
                .description(dto.getDescription())
                .severity(dto.getSeverity())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(incidentRepository.save(incident));
    }

    @GetMapping
    public ResponseEntity<List<Incident>> findAll() {
        return ResponseEntity.ok(incidentRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Incident> findById(@PathVariable Long id) {
        return ResponseEntity.ok(incidentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Incidente no encontrado")));
    }
}
