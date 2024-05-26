package com.employeeDirectory.employeeDirectory.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class EmployeeDTO {
    private Long id;
    private String name;
    private LocalDate birthDate;
    private String email;
    private String phone;
    private String bio;
    private LocalDate hiringDate;
    private String jobPosition;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private DepartmentDTO department;
    private LocationDTO location;
}
