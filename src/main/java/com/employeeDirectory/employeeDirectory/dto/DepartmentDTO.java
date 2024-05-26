package com.employeeDirectory.employeeDirectory.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DepartmentDTO {
    private Long id;
    private String name;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
