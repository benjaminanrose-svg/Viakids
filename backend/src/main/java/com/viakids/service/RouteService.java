package com.viakids.service;

import com.viakids.dto.RouteDto;
import com.viakids.model.Route;
import com.viakids.model.User;
import com.viakids.repository.RouteRepository;
import com.viakids.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final RouteRepository routeRepository;
    private final UserRepository userRepository;

    public List<Route> findAll() {
        return routeRepository.findAll();
    }

    public List<Route> findByConductor(Long conductorId) {
        return routeRepository.findByConductorId(conductorId);
    }

    public Route findById(Long id) {
        return routeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ruta no encontrada: " + id));
    }

    public Route create(RouteDto dto) {
        User conductor = dto.getConductorId() != null
                ? userRepository.findById(dto.getConductorId()).orElse(null)
                : null;
        Route route = Route.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .conductor(conductor)
                .startPoint(dto.getStartPoint())
                .endPoint(dto.getEndPoint())
                .active(true)
                .build();
        return routeRepository.save(route);
    }

    public Route update(Long id, RouteDto dto) {
        Route route = findById(id);
        route.setName(dto.getName());
        route.setDescription(dto.getDescription());
        route.setStartPoint(dto.getStartPoint());
        route.setEndPoint(dto.getEndPoint());
        if (dto.getConductorId() != null) {
            userRepository.findById(dto.getConductorId()).ifPresent(route::setConductor);
        }
        return routeRepository.save(route);
    }

    public void delete(Long id) {
        routeRepository.deleteById(id);
    }
}
