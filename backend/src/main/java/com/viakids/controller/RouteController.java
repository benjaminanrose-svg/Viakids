package com.viakids.controller;

import com.viakids.dto.RouteDto;
import com.viakids.model.Role;
import com.viakids.model.Route;
import com.viakids.model.User;
import com.viakids.service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;

    @GetMapping
    public ResponseEntity<List<Route>> findAll(@AuthenticationPrincipal User currentUser) {
        if (currentUser.getRole() == Role.CONDUCTOR) {
            return ResponseEntity.ok(routeService.findByConductor(currentUser.getId()));
        }
        return ResponseEntity.ok(routeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Route> findById(@PathVariable Long id) {
        return ResponseEntity.ok(routeService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Route> create(@RequestBody RouteDto dto) {
        return ResponseEntity.ok(routeService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Route> update(@PathVariable Long id, @RequestBody RouteDto dto) {
        return ResponseEntity.ok(routeService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        routeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
