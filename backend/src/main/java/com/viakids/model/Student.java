package com.viakids.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "students")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String rut;

    private String grade;

    private String school;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "apoderado_id", nullable = false)
    @JsonIgnoreProperties({"password", "authorities", "username", "accountNonExpired", "accountNonLocked", "credentialsNonExpired", "enabled"})
    private User apoderado;

    @Column(name = "qr_code", unique = true)
    private String qrCode;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;
}
