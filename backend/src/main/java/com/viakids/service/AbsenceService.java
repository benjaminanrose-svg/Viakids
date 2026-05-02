package com.viakids.service;

import com.viakids.dto.AbsenceDto;
import com.viakids.model.Absence;
import com.viakids.model.Student;
import com.viakids.model.User;
import com.viakids.repository.AbsenceRepository;
import com.viakids.repository.StudentRepository;
import com.viakids.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AbsenceService {

    private final AbsenceRepository absenceRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    public List<Absence> getAllAbsences() {
        return absenceRepository.findAll();
    }

    public List<Absence> getAbsencesByApoderado(Long apoderadoId) {
        return absenceRepository.findByApoderadoId(apoderadoId);
    }

    public List<Absence> getAbsencesByStudent(Long studentId) {
        return absenceRepository.findByStudentId(studentId);
    }

    public List<Absence> getAbsencesByDate(LocalDate date) {
        return absenceRepository.findByDate(date);
    }

    public List<Absence> getTodayAbsencesForConductor(Long conductorId) {
        return absenceRepository.findTodayAbsencesForConductor(conductorId, LocalDate.now());
    }

    @Transactional
    public Absence createAbsence(AbsenceDto dto, Long apoderadoId) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found: " + dto.getStudentId()));

        User apoderado = userRepository.findById(apoderadoId)
                .orElseThrow(() -> new RuntimeException("Apoderado not found: " + apoderadoId));

        Absence absence = Absence.builder()
                .student(student)
                .apoderado(apoderado)
                .date(dto.getDate() != null ? dto.getDate() : LocalDate.now())
                .reason(dto.getReason())
                .build();

        Absence saved = absenceRepository.save(absence);
        log.info("Absence reported for student {} on {}", student.getName(), absence.getDate());
        return saved;
    }

    @Transactional
    public void deleteAbsence(Long id) {
        absenceRepository.deleteById(id);
    }
}
