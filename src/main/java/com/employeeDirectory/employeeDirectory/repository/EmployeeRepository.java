package com.employeeDirectory.employeeDirectory.repository;

import com.employeeDirectory.employeeDirectory.entity.Department;
import com.employeeDirectory.employeeDirectory.entity.Employee;
import com.employeeDirectory.employeeDirectory.entity.Location;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import static org.hibernate.sql.ast.Clause.WHERE;


@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    @Query("SELECT e FROM Employee e " +
            "LEFT JOIN FETCH e.department d " +
            "LEFT JOIN FETCH e.location l " +
            "WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(e.bio) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(e.phone) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(e.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(CAST(e.birthDate AS string)) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(e.jobPosition) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(CAST(e.hiringDate AS string)) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(e.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(l.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(l.address) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(CAST(l.latitude AS string)) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(CAST(l.longitude AS string)) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(l.zipCode) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Employee> searchEmployees(@Param("searchTerm") String searchTerm, Pageable pageable);

    Page<Employee> findByDepartment(Department department, Pageable pageable);

    Page<Employee> findByLocation(Location location, Pageable pageable);
}
