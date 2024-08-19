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

    Optional<OurUsers> findByEmail(String email);

//    @Transactional
//    @Modifying
//    @Query("DELETE FROM UserRole ur WHERE ur.user.id = :userId")
//            void deleteUserRolesByUserId(@Param("userId") Integer userId);

}
