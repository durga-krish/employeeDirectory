package com.employeeDirectory.employeeDirectory.repository;

import com.employeeDirectory.employeeDirectory.entity.OurUsers;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<OurUsers, Integer> {

   // Optional<OurUsers> findByEmail(String email);

    @Query("SELECT u FROM OurUsers u JOIN FETCH u.roles WHERE u.email = :email")
    Optional<OurUsers> findByEmail(@Param("email") String email);


}
