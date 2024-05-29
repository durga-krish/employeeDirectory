package com.employeeDirectory.employeeDirectory.repository;

import com.employeeDirectory.employeeDirectory.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    @Query("SELECT e FROM Employee e WHERE " +
            "LOWER(e.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(e.bio) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(e.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(e.phone) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(e.jobPosition) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "CAST(e.birthDate AS string) LIKE CONCAT('%', :searchTerm, '%') OR " +
            "CAST(e.hiringDate AS string) LIKE CONCAT('%', :searchTerm, '%')")
    List<Employee> searchEmployees(@Param("searchTerm") String searchTerm);

}
