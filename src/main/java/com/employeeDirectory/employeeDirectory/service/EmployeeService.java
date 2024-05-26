package com.employeeDirectory.employeeDirectory.service;

import com.employeeDirectory.employeeDirectory.dto.DepartmentDTO;
import com.employeeDirectory.employeeDirectory.dto.EmployeeDTO;
import com.employeeDirectory.employeeDirectory.dto.LocationDTO;
import com.employeeDirectory.employeeDirectory.entity.Department;
import com.employeeDirectory.employeeDirectory.entity.Employee;
import com.employeeDirectory.employeeDirectory.entity.Location;
import com.employeeDirectory.employeeDirectory.repository.DepartmentRepository;
import com.employeeDirectory.employeeDirectory.repository.EmployeeRepository;
import com.employeeDirectory.employeeDirectory.repository.LocationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private LocationRepository locationRepository;

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Employee not found with id " + id));
    }



    public EmployeeDTO createEmployee(EmployeeDTO employeeDTO) {
        Employee employee = new Employee();
        employee.setName(employeeDTO.getName());
        employee.setBirthDate(employeeDTO.getBirthDate());
        employee.setEmail(employeeDTO.getEmail());
        employee.setPhone(employeeDTO.getPhone());
        employee.setBio(employeeDTO.getBio());
        employee.setHiringDate(employeeDTO.getHiringDate());
        employee.setJobPosition(employeeDTO.getJobPosition());
        employee.setIsActive(employeeDTO.getIsActive());

        Optional<Department> department = departmentRepository.findById(employeeDTO.getDepartment().getId());
        Optional<Location> location = locationRepository.findById(employeeDTO.getLocation().getId());

        if (department.isPresent()) {
            employee.setDepartment(department.get());
        } else {
            throw new IllegalArgumentException("Invalid department ID");
        }

        if (location.isPresent()) {
            employee.setLocation(location.get());
        } else {
            throw new IllegalArgumentException("Invalid location ID");
        }

        Employee savedEmployee = employeeRepository.save(employee);
        return convertToDTO(savedEmployee);
    }

    private EmployeeDTO convertToDTO(Employee employee) {
        EmployeeDTO employeeDTO = new EmployeeDTO();
        employeeDTO.setId(employee.getId());
        employeeDTO.setName(employee.getName());
        employeeDTO.setBirthDate(employee.getBirthDate());
        employeeDTO.setEmail(employee.getEmail());
        employeeDTO.setPhone(employee.getPhone());
        employeeDTO.setBio(employee.getBio());
        employeeDTO.setHiringDate(employee.getHiringDate());
        employeeDTO.setJobPosition(employee.getJobPosition());
        employeeDTO.setIsActive(employee.getIsActive());
        employeeDTO.setCreatedAt(employee.getCreatedAt());
        employeeDTO.setUpdatedAt(employee.getUpdatedAt());

        DepartmentDTO departmentDTO  = new DepartmentDTO();
        departmentDTO.setId(employee.getDepartment().getId());
        departmentDTO.setName(employee.getDepartment().getName());
        departmentDTO.setIsActive(employee.getDepartment().getIsActive());
        departmentDTO.setCreatedAt(employee.getDepartment().getCreatedAt());
        departmentDTO.setUpdatedAt(employee.getDepartment().getUpdatedAt());

        LocationDTO locationDTO = new LocationDTO();
        locationDTO.setId(employee.getLocation().getId());
        locationDTO.setName(employee.getLocation().getName());
        locationDTO.setAddress(employee.getLocation().getAddress());
        locationDTO.setZipCode(employee.getLocation().getZipCode());
        locationDTO.setLatitude(employee.getLocation().getLatitude());
        locationDTO.setLongitude(employee.getLocation().getLongitude());
        locationDTO.setCreatedAt(employee.getLocation().getCreatedAt());
        locationDTO.setUpdatedAt(employee.getLocation().getUpdatedAt());

        employeeDTO.setDepartment(departmentDTO);
        employeeDTO.setLocation(locationDTO);

        return employeeDTO;
    }
}
