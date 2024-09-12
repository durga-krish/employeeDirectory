package com.employeeDirectory.employeeDirectory.repository;

import com.employeeDirectory.employeeDirectory.entity.Role1;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role1, Integer> {

    Role1 findByName(String name);
}