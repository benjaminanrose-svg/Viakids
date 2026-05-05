package com.viakids.controller;

import com.viakids.dto.ScanRequest;
import com.viakids.model.Attendance;
import com.viakids.model.Attendance.AttendanceAction;
import com.viakids.model.Notification.NotificationType;
import com.viakids.model.Student;
import com.viakids.model.User;
import com.viakids.repository.AttendanceRepository;
import com.viakids.repository.StudentRepository;
import com.viakids.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final NotificationService notificationService;

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

    @PostMapping("/scan")
    public ResponseEntity<?> scan(@Valid @RequestBody ScanRequest request,
                                  @AuthenticationPrincipal User conductor) {
        Student student = studentRepository.findByQrCode(request.getQrCode())
                .orElse(null);

        if (student == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Código QR no reconocido"));
        }

        Attendance attendance = Attendance.builder()
                .student(student)
                .conductor(conductor)
                .action(request.getAction())
                .routeId(request.getRouteId())
                .timestamp(LocalDateTime.now())
                .build();
        attendanceRepository.save(attendance);

        // Notificar al apoderado
        String hora = LocalDateTime.now().format(TIME_FMT);
        String accion = request.getAction() == AttendanceAction.SUBIDA ? "subió al" : "bajó del";
        NotificationType tipo = request.getAction() == AttendanceAction.SUBIDA
                ? NotificationType.SUBIDA : NotificationType.BAJADA;

        notificationService.send(
                student.getApoderado().getId(),
                request.getAction() == AttendanceAction.SUBIDA ? "Estudiante a bordo" : "Estudiante llegó",
                String.format("%s %s furgón a las %s.", student.getName(), accion, hora),
                tipo
        );

        return ResponseEntity.ok(Map.of(
                "student", Map.of("name", student.getName()),
                "action", request.getAction(),
                "timestamp", hora
        ));
    }

    @GetMapping("/today")
    public ResponseEntity<List<Attendance>> today(@AuthenticationPrincipal User conductor) {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        return ResponseEntity.ok(
                attendanceRepository.findByConductorIdAndTimestampBetween(
                        conductor.getId(), startOfDay, LocalDateTime.now())
        );
    }
}
