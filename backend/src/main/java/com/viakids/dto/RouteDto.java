package com.viakids.dto;

import lombok.Data;

@Data
public class RouteDto {
    private String name;
    private String description;
    private Long conductorId;
    private String startPoint;
    private String endPoint;
}
