package com.viakids.service;

import com.viakids.dto.VehicleDto;
import com.viakids.model.User;
import com.viakids.model.Vehicle;
import com.viakids.repository.UserRepository;
import com.viakids.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    public List<Vehicle> findAll() {
        return vehicleRepository.findAll();
    }

    public Vehicle findById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehículo no encontrado: " + id));
    }

    @Transactional
    public Vehicle create(VehicleDto dto) {
        User conductor = dto.getConductorId() != null
                ? userRepository.findById(dto.getConductorId()).orElse(null)
                : null;
        Vehicle vehicle = Vehicle.builder()
                .plate(dto.getPlate())
                .brand(dto.getBrand())
                .model(dto.getModel())
                .year(dto.getYear())
                .capacity(dto.getCapacity())
                .conductor(conductor)
                .active(true)
                .build();
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public Vehicle update(Long id, VehicleDto dto) {
        Vehicle vehicle = findById(id);
        vehicle.setPlate(dto.getPlate());
        vehicle.setBrand(dto.getBrand());
        vehicle.setModel(dto.getModel());
        vehicle.setYear(dto.getYear());
        vehicle.setCapacity(dto.getCapacity());
        if (dto.getConductorId() != null) {
            userRepository.findById(dto.getConductorId()).ifPresent(vehicle::setConductor);
        } else {
            vehicle.setConductor(null);
        }
        return vehicleRepository.save(vehicle);
    }

    public void delete(Long id) {
        vehicleRepository.deleteById(id);
    }
}
