package com.viakids.repository;

import com.viakids.model.Route;
import com.viakids.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    List<Route> findByConductor(User conductor);
    List<Route> findByConductorId(Long conductorId);
    List<Route> findByActiveTrue();
    Optional<Route> findByName(String name);
}
