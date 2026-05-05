package com.viakids.dto;

import com.viakids.model.Attendance.AttendanceAction;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ScanRequest {
    @NotBlank
    private String qrCode;
    @NotNull
    private AttendanceAction action;
    private Long routeId;
}
