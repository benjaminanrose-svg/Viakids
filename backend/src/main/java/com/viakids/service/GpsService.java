package com.viakids.service;

import com.viakids.dto.GpsUpdateDto;
import com.viakids.model.GpsLocation;
import com.viakids.repository.GpsLocationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class GpsService {

    private final GpsLocationRepository gpsLocationRepository;

    @Transactional
    public GpsLocation updateLocation(Long conductorId, GpsUpdateDto dto) {
        GpsLocation location = GpsLocation.builder()
                .conductorId(conductorId)
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .routeId(dto.getRouteId())
                .timestamp(LocalDateTime.now())
                .build();
        GpsLocation saved = gpsLocationRepository.save(location);
        log.debug("GPS updated for conductor {}: {},{}", conductorId, dto.getLatitude(), dto.getLongitude());
        return saved;
    }

    public Optional<GpsLocation> getLastLocation(Long conductorId) {
        return gpsLocationRepository.findTopByConductorIdOrderByTimestampDesc(conductorId);
    }
}
