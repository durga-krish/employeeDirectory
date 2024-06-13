package com.employeeDirectory.employeeDirectory.service;

import com.employeeDirectory.employeeDirectory.dto.DepartmentDTO;
import com.employeeDirectory.employeeDirectory.entity.Department;
import com.employeeDirectory.employeeDirectory.repository.DepartmentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;


    public List<DepartmentDTO> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();
        return departments.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Department not found with id " + id));
    }

    public DepartmentDTO createDepartment(DepartmentDTO departmentDTO) {
        Department department = new Department();
        department.setName(departmentDTO.getName());
        department.setIsActive(departmentDTO.getIsActive());
        Department savedDepartment = departmentRepository.save(department);
        return convertToDTO(savedDepartment);
    }

    public DepartmentDTO updateDepartment(Long id, DepartmentDTO departmentDTO) {
        Department existingDepartment = getDepartmentById(id);
        existingDepartment.setName(departmentDTO.getName());
        existingDepartment.setIsActive(departmentDTO.getIsActive());
        Department updatedDepartment = departmentRepository.save(existingDepartment);
        return convertToDTO(updatedDepartment);
    }

    public void deleteDepartment(Long id) {
        Department department = getDepartmentById(id);
        departmentRepository.delete(department);
    }

    public DepartmentDTO convertToDTO(Department department) {
        DepartmentDTO departmentDTO = new DepartmentDTO();
        departmentDTO.setId(department.getId());
        departmentDTO.setName(department.getName());
        departmentDTO.setIsActive(department.getIsActive());
        departmentDTO.setCreatedAt(department.getCreatedAt());
        departmentDTO.setUpdatedAt(department.getUpdatedAt());
        return departmentDTO;
    }
}
