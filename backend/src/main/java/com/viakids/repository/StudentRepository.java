package com.viakids.repository;

import com.viakids.model.Student;
import com.viakids.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByApoderado(User apoderado);
    List<Student> findByApoderadoId(Long apoderadoId);
    Optional<Student> findByQrCode(String qrCode);
    Optional<Student> findByRut(String rut);
    List<Student> findByActiveTrue();
}
