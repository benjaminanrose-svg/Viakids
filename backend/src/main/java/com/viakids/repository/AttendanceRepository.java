package com.viakids.repository;

import com.viakids.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudentIdAndTimestampBetween(Long studentId, LocalDateTime from, LocalDateTime to);
    List<Attendance> findByConductorIdAndTimestampBetween(Long conductorId, LocalDateTime from, LocalDateTime to);
}
