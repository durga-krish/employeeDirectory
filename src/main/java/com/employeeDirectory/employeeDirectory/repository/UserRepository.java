package com.employeeDirectory.employeeDirectory.repository;

import com.employeeDirectory.employeeDirectory.entity.OurUsers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<OurUsers, Integer> {

    Optional<OurUsers> findByEmail(String email);
}
