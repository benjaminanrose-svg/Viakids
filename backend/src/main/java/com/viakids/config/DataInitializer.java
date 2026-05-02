package com.viakids.config;

import com.viakids.model.Role;
import com.viakids.model.User;
import com.viakids.repository.UserRepository;
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
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("admin@viakids.cl").isEmpty()) {
            User admin = User.builder()
                    .name("Administrador ViaKids")
                    .email("admin@viakids.cl")
                    .password(passwordEncoder.encode("Admin123!"))
                    .role(Role.ADMIN)
                    .phone("+56 9 0000 0001")
                    .active(true)
                    .build();
            userRepository.save(admin);
            log.info("Admin user created: admin@viakids.cl / Admin123!");
        }

        if (userRepository.findByEmail("conductor@viakids.cl").isEmpty()) {
            User conductor = User.builder()
                    .name("Juan Pérez (Conductor)")
                    .email("conductor@viakids.cl")
                    .password(passwordEncoder.encode("Conductor123!")  )
                    .role(Role.CONDUCTOR)
                    .phone("+56 9 1111 1111")
                    .active(true)
                    .build();
            userRepository.save(conductor);
            log.info("Conductor user created: conductor@viakids.cl / Conductor123!");
        }

        if (userRepository.findByEmail("apoderado@viakids.cl").isEmpty()) {
            User apoderado = User.builder()
                    .name("María González (Apoderada)")
                    .email("apoderado@viakids.cl")
                    .password(passwordEncoder.encode("Apoderado123!"))
                    .role(Role.APODERADO)
                    .phone("+56 9 2222 2222")
                    .active(true)
                    .build();
            userRepository.save(apoderado);
            log.info("Apoderado user created: apoderado@viakids.cl / Apoderado123!");
        }
    }
}
