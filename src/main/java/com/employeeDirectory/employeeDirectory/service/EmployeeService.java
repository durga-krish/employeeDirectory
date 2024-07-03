package com.employeeDirectory.employeeDirectory.service;

import com.employeeDirectory.employeeDirectory.dto.DepartmentDTO;
import com.employeeDirectory.employeeDirectory.dto.EmployeeDTO;
import com.employeeDirectory.employeeDirectory.dto.LocationDTO;
import com.employeeDirectory.employeeDirectory.entity.Department;
import com.employeeDirectory.employeeDirectory.entity.Employee;
import com.employeeDirectory.employeeDirectory.entity.Location;
import com.employeeDirectory.employeeDirectory.exception.FileStorageException;
import com.employeeDirectory.employeeDirectory.repository.DepartmentRepository;
import com.employeeDirectory.employeeDirectory.repository.EmployeeRepository;
import com.employeeDirectory.employeeDirectory.repository.LocationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.nio.file.*;
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

    private final Path fileStorageLocation = Paths.get("employee-photos")
            .toAbsolutePath().normalize();

    public String savePicture(MultipartFile pictureFile) {
        if (pictureFile != null && !pictureFile.isEmpty()) {
            String fileName = StringUtils.cleanPath(pictureFile.getOriginalFilename());
            Path uploadPath = this.fileStorageLocation.resolve(fileName).normalize();
            try {
                Files.copy(pictureFile.getInputStream(), uploadPath, StandardCopyOption.REPLACE_EXISTING);
                return fileName;
            } catch (IOException ex) {
                throw new FileStorageException("Could not store file " + fileName + ". Please try again!", ex);
            }
        }
        return null;
    }

    public byte[] getEmployeePicture(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id " + id));

        String fileName = employee.getPicture();
        Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
        try {
            return Files.readAllBytes(filePath);
        } catch (IOException ex) {
            throw new FileStorageException("Could not read file: " + fileName, ex);
        }
    }

    public Resource loadPictureAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read the file: " + fileName);
            }
        } catch (IOException ex) {
            throw new RuntimeException("File not found " + fileName, ex);
        }
    }

    public Page<EmployeeDTO> getAllEmployees(int page, int size, String sortBy, String order) {
        Sort sort = Sort.by(Sort.Direction.fromString(order), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
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

        if (employeeDTO.getPictureFile() != null) {
            employee.setPicture(savePicture(employeeDTO.getPictureFile()));
        }

        Optional<Department> department = departmentRepository.findById(employeeDTO.getDepartment().getId());
        department.ifPresentOrElse(
                dept -> employee.setDepartment(dept),
                () -> {
                    throw new EntityNotFoundException("Department not found with id " + employeeDTO.getDepartment().getId());
                }
        );

        Optional<Location> location = locationRepository.findById(employeeDTO.getLocation().getId());
        location.ifPresentOrElse(
                loc -> employee.setLocation(loc),
                () -> {
                    throw new EntityNotFoundException("Location not found with id " + employeeDTO.getLocation().getId());
                }
        );

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

        if (employeeDTO.getPictureFile() != null && !employeeDTO.getPictureFile().isEmpty()) {
            existingEmployee.setPicture(savePicture(employeeDTO.getPictureFile()));
            existingEmployee.setPictureFileName(employeeDTO.getPictureFile().getOriginalFilename());
        }

        Employee updatedEmployee = employeeRepository.save(existingEmployee);
        return convertToDTO(updatedEmployee);
    }

    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id " + id));
        employeeRepository.delete(employee);
    }

    public Page<EmployeeDTO> searchEmployees(String searchTerm, int page, int size, String sortBy, String order) {
        Sort sort = Sort.by(Sort.Direction.fromString(order), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Employee> employeePage = employeeRepository.searchEmployees(searchTerm, pageable);
        return convertToDtoPage(employeePage);
    }

    public Page<EmployeeDTO> findByDepartment(Long departmentId, int page, int size, String sortBy, String order) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new IllegalArgumentException("Department not found"));
        Sort sort = Sort.by(Sort.Direction.fromString(order), sortBy);
        Pageable pageable = PageRequest.of(page, size);
        Page<Employee> employeePage = employeeRepository.findByDepartment(department, pageable);
        return convertToDtoPage(employeePage);
    }

    public Page<EmployeeDTO> findByLocation(Long locationId, int page, int size, String sortBy, String order) {
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new IllegalArgumentException("Location not found"));
        Sort sort = Sort.by(Sort.Direction.fromString(order), sortBy);
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

        if (employee.getDepartment() !=null) {
            DepartmentDTO departmentDTO = new DepartmentDTO();
            departmentDTO.setId(employee.getDepartment().getId());
            departmentDTO.setName(employee.getDepartment().getName());
            departmentDTO.setIsActive(employee.getDepartment().getIsActive());
            departmentDTO.setCreatedAt(employee.getDepartment().getCreatedAt());
            departmentDTO.setUpdatedAt(employee.getDepartment().getUpdatedAt());
            employeeDTO.setDepartment(departmentDTO);
        }

        if (employee.getLocation() !=null) {
            LocationDTO locationDTO = new LocationDTO();
            locationDTO.setId(employee.getLocation().getId());
            locationDTO.setName(employee.getLocation().getName());
            locationDTO.setAddress(employee.getLocation().getAddress());
            locationDTO.setZipCode(employee.getLocation().getZipCode());
            locationDTO.setLatitude(employee.getLocation().getLatitude());
            locationDTO.setLongitude(employee.getLocation().getLongitude());
            locationDTO.setCreatedAt(employee.getLocation().getCreatedAt());
            locationDTO.setUpdatedAt(employee.getLocation().getUpdatedAt());
            employeeDTO.setLocation(locationDTO);
        }
        employeeDTO.setPictureFile(null);

        return employeeDTO;
    }
}