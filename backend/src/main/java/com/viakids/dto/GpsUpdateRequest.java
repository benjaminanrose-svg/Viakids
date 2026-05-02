package com.viakids.dto;

import lombok.Data;

@Data
public class GpsUpdateRequest {
    private Double latitude;
    private Double longitude;
    private Long routeId;
}
