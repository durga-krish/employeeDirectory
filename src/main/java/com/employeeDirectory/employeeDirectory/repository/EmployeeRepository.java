package com.employeeDirectory.employeeDirectory.repository;

import com.employeeDirectory.employeeDirectory.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    @Query("SELECT e from Employee e " +
            "LEFT JOIN e.department d " +
            "left join e.location l " +
            "where lower(e.name) like lower(concat('%', :searchTerm, '%')) " +
            "OR lower(e.birthDate) like LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(e.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(e.phone) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(e.bio) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(e.hiringDate) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(e.jobPosition) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(d.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(l.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(l.address) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(l.latitude) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(l.longitude) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(l.zipCode) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")

    List<Employee> searchEmployees(@Param("searchTerm") String searchTerm);
}
