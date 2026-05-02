package com.viakids.dto;

import lombok.Data;

@Data
public class IncidentDto {
    private Long routeId;
    private String description;
    private String severity;
}
