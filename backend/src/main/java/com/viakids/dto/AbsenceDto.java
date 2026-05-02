package com.viakids.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AbsenceDto {
    private Long studentId;
    private LocalDate date;
    private String reason;
}
