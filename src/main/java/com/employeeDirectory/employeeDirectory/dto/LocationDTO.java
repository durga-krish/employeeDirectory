package com.employeeDirectory.employeeDirectory.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LocationDTO {
    private Long id;
    private String name;
    private String address;
    private String zipCode;
    private Double latitude;
    private Double longitude;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
