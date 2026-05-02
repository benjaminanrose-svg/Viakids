package com.viakids.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GpsUpdateDto {

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private Long routeId;
}
