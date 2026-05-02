package com.viakids.controller;

import com.viakids.dto.StudentDto;
import com.viakids.model.Role;
import com.viakids.model.Student;
import com.viakids.model.User;
import com.viakids.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    public ResponseEntity<List<Student>> findAll(@AuthenticationPrincipal User currentUser) {
        if (currentUser.getRole() == Role.APODERADO) {
            return ResponseEntity.ok(studentService.findByApoderado(currentUser.getId()));
        }
        return ResponseEntity.ok(studentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> findById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Student> create(@RequestBody StudentDto dto,
                                          @AuthenticationPrincipal User currentUser) {
        if (currentUser.getRole() == Role.APODERADO) {
            dto.setApoderadoId(currentUser.getId());
        }
        return ResponseEntity.ok(studentService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> update(@PathVariable Long id, @RequestBody StudentDto dto) {
        return ResponseEntity.ok(studentService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        studentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
