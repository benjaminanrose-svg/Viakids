package com.viakids.config;

import com.viakids.model.*;
import com.viakids.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final RouteRepository routeRepository;
    private final VehicleRepository vehicleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create users only if they don't exist yet
        User admin = userRepository.findByEmail("admin@viakids.cl").orElseGet(() ->
                userRepository.save(User.builder()
                        .name("Administrador ViaKids")
                        .email("admin@viakids.cl")
                        .password(passwordEncoder.encode("Admin123!"))
                        .role(Role.ADMIN).phone("+56 9 0000 0001").active(true).build()));

        User conductor = userRepository.findByEmail("conductor@viakids.cl").orElseGet(() ->
                userRepository.save(User.builder()
                        .name("Juan Pérez")
                        .email("conductor@viakids.cl")
                        .password(passwordEncoder.encode("Conductor123!"))
                        .role(Role.CONDUCTOR).phone("+56 9 1111 1111").active(true).build()));

        User apoderado = userRepository.findByEmail("apoderado@viakids.cl").orElseGet(() ->
                userRepository.save(User.builder()
                        .name("María González")
                        .email("apoderado@viakids.cl")
                        .password(passwordEncoder.encode("Apoderado123!"))
                        .role(Role.APODERADO).phone("+56 9 2222 2222").active(true).build()));

        // Create route if not exists
        if (routeRepository.findByName("Ruta Norte — Colegio San Marcos").isEmpty()) {
            routeRepository.save(Route.builder()
                    .name("Ruta Norte — Colegio San Marcos")
                    .description("Recorrido sector norte hacia colegio")
                    .conductor(conductor)
                    .startPoint("Av. Providencia 1234")
                    .endPoint("Colegio San Marcos, Lo Barnechea")
                    .active(true).build());
            log.info("Demo route created");
        }

        // Create vehicle if not exists
        if (vehicleRepository.findAll().isEmpty()) {
            vehicleRepository.save(Vehicle.builder()
                    .plate("ABCD-12")
                    .brand("Mercedes-Benz")
                    .model("Sprinter")
                    .year(2020).capacity(20)
                    .conductor(conductor)
                    .active(true).build());
            log.info("Demo vehicle created");
        }

        // Create students if not exist
        if (studentRepository.findByRut("22.111.111-1").isEmpty()) {
            studentRepository.save(Student.builder()
                    .name("Sofía González")
                    .rut("22.111.111-1")
                    .grade("4° Básico")
                    .school("Colegio San Marcos")
                    .apoderado(apoderado)
                    .qrCode("QR-SOFIA-001")
                    .active(true).build());
            log.info("Demo student Sofía created");
        }

        if (studentRepository.findByRut("22.222.222-2").isEmpty()) {
            studentRepository.save(Student.builder()
                    .name("Matías González")
                    .rut("22.222.222-2")
                    .grade("2° Básico")
                    .school("Colegio San Marcos")
                    .apoderado(apoderado)
                    .qrCode("QR-MATIAS-002")
                    .active(true).build());
            log.info("Demo student Matías created");
        }

        log.info("=== DEMO CREDENTIALS: admin@viakids.cl/Admin123! | conductor@viakids.cl/Conductor123! | apoderado@viakids.cl/Apoderado123! ===");
    }
}
