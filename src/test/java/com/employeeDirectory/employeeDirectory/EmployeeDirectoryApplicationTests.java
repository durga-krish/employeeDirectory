//package com.employeeDirectory.employeeDirectory;
//
//import com.employeeDirectory.employeeDirectory.entity.OurUsers;
//import com.employeeDirectory.employeeDirectory.repository.UserRepository;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import java.util.Optional;
//
//import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
//import static org.junit.jupiter.api.Assertions.assertFalse;
//import static org.junit.jupiter.api.Assertions.assertTrue;
//
//@SpringBootTest
//class EmployeeDirectoryApplicationTests {
//
//	@Autowired
//	private UserRepository userRepository;
//
//	@Test
//	public void testFindByEmail() {
//		// Create a test user with roles in the database, or use an existing test user.
//		String email = "testuser@example.com";
//
//		Optional<OurUsers> userOptional = userRepository.findByEmail(email);
//
//		assertTrue(userOptional.isPresent());
//		OurUsers user = userOptional.get();
//		assertNotNull(user.getRoles());
//		assertFalse(user.getRoles().isEmpty());
//
//		// Print roles for debugging
//		System.out.println("Roles for user: " + user.getRoles());
//	}
//	}
//
