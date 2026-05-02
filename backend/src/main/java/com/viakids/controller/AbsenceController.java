package com.viakids.controller;

import com.viakids.dto.AbsenceDto;
import com.viakids.model.Absence;
import com.viakids.model.Student;
import com.viakids.model.User;
import com.viakids.repository.AbsenceRepository;
import com.viakids.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/absences")
@RequiredArgsConstructor
public class AbsenceController {

    private final AbsenceRepository absenceRepository;
    private final StudentRepository studentRepository;

    @PostMapping
    public ResponseEntity<Absence> reportAbsence(@RequestBody AbsenceDto dto,
                                                 @AuthenticationPrincipal User currentUser) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Estudiante no encontrado"));
        Absence absence = Absence.builder()
                .student(student)
                .apoderado(currentUser)
                .date(dto.getDate() != null ? dto.getDate() : LocalDate.now())
                .reason(dto.getReason())
                .createdAt(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(absenceRepository.save(absence));
    }

    @GetMapping("/today")
    public ResponseEntity<List<Absence>> getTodayAbsences() {
        return ResponseEntity.ok(absenceRepository.findByDate(LocalDate.now()));
    }

    @GetMapping
    public ResponseEntity<List<Absence>> findAll() {
        return ResponseEntity.ok(absenceRepository.findAll());
    }
}
