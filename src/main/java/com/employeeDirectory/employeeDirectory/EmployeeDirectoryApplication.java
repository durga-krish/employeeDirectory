package com.employeeDirectory.employeeDirectory;

import jakarta.servlet.MultipartConfigElement;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@SpringBootApplication
@EnableWebMvc
public class EmployeeDirectoryApplication {

	public static void main(String[] args) {
		SpringApplication.run(EmployeeDirectoryApplication.class, args);
	}


}
