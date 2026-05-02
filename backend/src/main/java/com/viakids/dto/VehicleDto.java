package com.viakids.dto;

import lombok.Data;

@Data
public class VehicleDto {
    private String plate;
    private String brand;
    private String model;
    private Integer year;
    private Integer capacity;
    private Long conductorId;
}
