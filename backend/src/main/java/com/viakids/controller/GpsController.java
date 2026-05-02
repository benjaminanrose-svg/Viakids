package com.viakids.controller;

import com.viakids.dto.GpsUpdateDto;
import com.viakids.model.GpsLocation;
import com.viakids.model.User;
import com.viakids.repository.GpsLocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/gps")
@RequiredArgsConstructor
public class GpsController {

    private final GpsLocationRepository gpsLocationRepository;

    @PostMapping("/update")
    public ResponseEntity<GpsLocation> update(@RequestBody GpsUpdateDto request,
                                              @AuthenticationPrincipal User currentUser) {
        GpsLocation location = GpsLocation.builder()
                .conductorId(currentUser.getId())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .routeId(request.getRouteId())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(gpsLocationRepository.save(location));
    }

    @GetMapping("/location/{conductorId}")
    public ResponseEntity<GpsLocation> getLastLocation(@PathVariable Long conductorId) {
        Optional<GpsLocation> location =
                gpsLocationRepository.findTopByConductorIdOrderByTimestampDesc(conductorId);
        return location.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
