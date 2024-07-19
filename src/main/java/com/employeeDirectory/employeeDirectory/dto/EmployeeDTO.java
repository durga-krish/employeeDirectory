package com.employeeDirectory.employeeDirectory.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class EmployeeDTO {
    private Long id;

    //@NotBlank(message = "Name is mandatory")
    private String name;

    //@NotNull(message = "Birth Date is mandatory")
    private LocalDate birthDate;

   // @NotBlank(message = "Email is mandatory")
    //@Email(message = "Email should be valid")
    private String email;

    //@NotBlank(message = "Phone is mandatory")
    //@Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone number should be valid")
    private String phone;

    private String bio;

   // @NotNull(message = "Hiring Date is mandatory")
    private LocalDate hiringDate;

   // @NotBlank(message = "Job Position is mandatory")
    private String jobPosition;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private DepartmentDTO department;
    private LocationDTO location;
    private MultipartFile pictureFile;
    private String picture;
    private String pictureFileName;

}
