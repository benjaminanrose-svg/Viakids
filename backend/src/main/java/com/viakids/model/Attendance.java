package com.viakids.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"apoderado", "hibernateLazyInitializer"})
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "conductor_id", nullable = false)
    @JsonIgnoreProperties({"password", "authorities", "username", "accountNonExpired",
            "accountNonLocked", "credentialsNonExpired", "enabled"})
    private User conductor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttendanceAction action;

    @Column(name = "route_id")
    private Long routeId;

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    public enum AttendanceAction {
        SUBIDA, BAJADA
    }
}
