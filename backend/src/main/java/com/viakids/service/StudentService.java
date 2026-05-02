package com.viakids.service;

import com.viakids.dto.StudentDto;
import com.viakids.model.Student;
import com.viakids.model.User;
import com.viakids.repository.StudentRepository;
import com.viakids.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    public List<Student> findAll() {
        return studentRepository.findAll();
    }

    public List<Student> findByApoderado(Long apoderadoId) {
        return studentRepository.findByApoderadoId(apoderadoId);
    }

    public Student findById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Estudiante no encontrado: " + id));
    }

    public Student create(StudentDto dto) {
        User apoderado = userRepository.findById(dto.getApoderadoId())
                .orElseThrow(() -> new IllegalArgumentException("Apoderado no encontrado"));
        Student student = Student.builder()
                .name(dto.getName())
                .rut(dto.getRut())
                .grade(dto.getGrade())
                .school(dto.getSchool())
                .apoderado(apoderado)
                .qrCode(UUID.randomUUID().toString())
                .active(true)
                .build();
        return studentRepository.save(student);
    }

    public Student update(Long id, StudentDto dto) {
        Student student = findById(id);
        student.setName(dto.getName());
        student.setGrade(dto.getGrade());
        student.setSchool(dto.getSchool());
        return studentRepository.save(student);
    }

    public void delete(Long id) {
        studentRepository.deleteById(id);
    }
}
