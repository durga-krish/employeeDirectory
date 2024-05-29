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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private LocationRepository locationRepository;

    public Page<EmployeeDTO> getAllEmployees(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Employee> employeePage = employeeRepository.findAll(pageable);
        return convertToDtoPage(employeePage);
    }

    public EmployeeDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id " + id));
        return convertToDTO(employee);
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

    public EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id " + id));

        existingEmployee.setName(employeeDTO.getName());
        existingEmployee.setBirthDate(employeeDTO.getBirthDate());
        existingEmployee.setEmail(employeeDTO.getEmail());
        existingEmployee.setPhone(employeeDTO.getPhone());
        existingEmployee.setBio(employeeDTO.getBio());
        existingEmployee.setHiringDate(employeeDTO.getHiringDate());
        existingEmployee.setJobPosition(employeeDTO.getJobPosition());
        existingEmployee.setIsActive(employeeDTO.getIsActive());

        Optional<Department> department = departmentRepository.findById(employeeDTO.getDepartment().getId());
        Optional<Location> location = locationRepository.findById(employeeDTO.getLocation().getId());

        if (department.isPresent()) {
            existingEmployee.setDepartment(department.get());
        } else {
            throw new IllegalArgumentException("Invalid department ID");
        }

        if (location.isPresent()) {
            existingEmployee.setLocation(location.get());
        } else {
            throw new IllegalArgumentException("Invalid location ID");
        }

        Employee updatedEmployee = employeeRepository.save(existingEmployee);
        return convertToDTO(updatedEmployee);
    }

    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id " + id));
        employeeRepository.delete(employee);
    }

    public Page<EmployeeDTO> searchEmployees(String searchTerm, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Employee> employeePage = employeeRepository.searchEmployees(searchTerm, pageable);
        return convertToDtoPage(employeePage);
    }

    public Page<EmployeeDTO> findByDepartment(Long departmentId, int page, int size) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new IllegalArgumentException("Department not found"));
        Pageable pageable = PageRequest.of(page, size);
        Page<Employee> employeePage = employeeRepository.findByDepartment(department, pageable);
        return convertToDtoPage(employeePage);
    }

    public Page<EmployeeDTO> findByLocation(Long locationId, int page, int size) {
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new IllegalArgumentException("Location not found"));
        Pageable pageable = PageRequest.of(page, size);
        Page<Employee> employeePage = employeeRepository.findByLocation(location, pageable);
        return convertToDtoPage(employeePage);
    }

    private Page<EmployeeDTO> convertToDtoPage(Page<Employee> employeePage) {
        List<EmployeeDTO> employeeDTOs = employeePage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return new PageImpl<>(employeeDTOs, employeePage.getPageable(), employeePage.getTotalElements());
    }


    public EmployeeDTO convertToDTO(Employee employee) {
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
