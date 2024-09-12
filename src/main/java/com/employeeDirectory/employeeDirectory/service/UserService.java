package com.employeeDirectory.employeeDirectory.service;

import com.employeeDirectory.employeeDirectory.dto.ReqRes1;
import com.employeeDirectory.employeeDirectory.entity.User;
import com.employeeDirectory.employeeDirectory.entity.Role1;
import com.employeeDirectory.employeeDirectory.repository.RoleRepository;
import com.employeeDirectory.employeeDirectory.repository.UserRepository;
//import lombok.var;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    private Set<Role1> resolveRoles(List<String> roleNames) {
        Set<Role1> roles = new HashSet<>();
        for (String roleName : roleNames) {
            Role1 role1 = roleRepository.findByName(roleName);
            if (role1 == null) {
                role1 = new Role1();
                role1.setName(roleName);
                role1 = roleRepository.save(role1);
            }
            roles.add(role1);
        }
        return roles;
    }

    public ReqRes1 registerUser(ReqRes1 registrationRequest) {
        ReqRes1 resp = new ReqRes1();
        try {
            User user = new User();
            user.setEmail(registrationRequest.getEmail());
            user.setName(registrationRequest.getName());
            user.setCity(registrationRequest.getCity());
            user.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));

            List<String> roleNames = registrationRequest.getRoles();
            if (roleNames == null || roleNames.isEmpty()) {
                throw new IllegalArgumentException("Role names must not be empty");
            }
            logger.info("Resolving roles: {}", roleNames);

            Set<Role1> resolvedRoles = resolveRoles(roleNames);
            logger.info("Resolved roles: {}", resolvedRoles);

            user.setRoles(resolvedRoles);

            User ourUsersResult = userRepository.save(user);
            if (ourUsersResult.getId() > 0) {
                resp.setUser(ourUsersResult);
                resp.setMessage("User Saved Successfully");
                resp.setStatusCode(200);
            }
        } catch (Exception e) {
            logger.error("Error registering user", e);
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

//    public String loginUser(ReqRes1 loginRequest) {
//        try {
//            // Authenticate user
//            Authentication authentication = authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
//            );
//
//            // Generate JWT token
//            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
//            return jwtUtils.generateToken(userDetails);
//        } catch (AuthenticationException e) {
//            logger.error("Error during login", e);
//            throw new RuntimeException("Invalid username or password");
//        }
//    }

    public ReqRes1 loginUser(ReqRes1 loginRequest) {
        ReqRes1 resp = new ReqRes1();

        try {
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),
                            loginRequest.getPassword()));
            User users = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
            String jwt = jwtUtils.generateToken(users);
            String refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), users);

            resp.setStatusCode(200);
            resp.setToken(jwt);
            //resp.setRoles(users.getRoles());
            resp.setRefreshToken(refreshToken);
            resp.setExpirationTime("24Hrs");
            resp.setMessage("User Login Successfully");

        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage(e.getMessage());
        }
        return resp;
    }

    public ReqRes1 refreshToken(ReqRes1 refreshTokenRequest) {
        ReqRes1 resp = new ReqRes1();
        try {
            String ourEmail = jwtUtils.extractUsername(refreshTokenRequest.getToken());
            User users = userRepository.findByEmail(ourEmail).orElseThrow();
            if (jwtUtils.isTokenValid(refreshTokenRequest.getToken(), users)){
                var jwt = jwtUtils.generateToken(users);
                resp.setStatusCode(200);
                resp.setToken(jwt);
                resp.setRefreshToken(refreshTokenRequest.getToken());
                resp.setExpirationTime("24Hrs");
                resp.setMessage("Successfully Refreshed Token");
            }
            resp.setStatusCode(200);
            return resp;
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage(e.getMessage());
            return resp;
        }
    }

    public List<ReqRes1>getAllUsers(){
        List<User>users=userRepository.findAll();
        return users.stream().map(user->{
            ReqRes1 dto=new ReqRes1();
            dto.setEmail(user.getEmail());
            dto.setName(user.getName());
            dto.setCity(user.getCity());
            dto.setRoles(user.getRoles().stream().map(Role1::getName)
                    .collect(Collectors.toList()));
            dto.setStatusCode(200);
            return dto;
        }).collect(Collectors.toList());
    }


    public ReqRes1 getUsersById(Integer id) {
        ReqRes1 reqRes1 = new ReqRes1();
        try {
            User usersById = userRepository.findById(id).orElseThrow(() ->
                    new RuntimeException("User with id " + id + " not found"));
            reqRes1.setUser(usersById);
            reqRes1.setStatusCode(200);
            reqRes1.setMessage("User with id " + id + " found");
        } catch (Exception e) {
            reqRes1.setStatusCode(500);
            reqRes1.setMessage("Error occurred: " + e.getMessage());
        }
        return reqRes1;
    }

    public ReqRes1 deleteUser(Integer userId){
        ReqRes1 reqRes1 = new ReqRes1();
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                user.getRoles().clear();
                userRepository.save(user);
                userRepository.deleteById(userId);
                reqRes1.setStatusCode(200);
                reqRes1.setMessage("User Deleted Successfully");
            } else {
                reqRes1.setStatusCode(404);
                reqRes1.setMessage("User not found for deletion");
            }
        } catch (Exception e) {
            reqRes1.setStatusCode(500);
            reqRes1.setMessage("Error occurred: " + e.getMessage());
        }
        return reqRes1;
    }

    public ReqRes1 updateUser(Integer userId, User updatedUser){
        ReqRes1 reqRes1 = new ReqRes1();
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                User existingUser = userOptional.get();
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setName(updatedUser.getName());
                existingUser.setCity(updatedUser.getCity());

                if (updatedUser.getPassword() !=null && !updatedUser.getPassword().isEmpty()) {
                    existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }

                if (updatedUser.getRoles() != null) {
                    existingUser.setRoles(resolveRoles(updatedUser.getRoles().stream().
                            map(Role1::getName).collect(Collectors.toList())));
                }

                User savedUser = userRepository.save(existingUser);
                reqRes1.setUser(savedUser);
                reqRes1.setStatusCode(200);
                reqRes1.setMessage("User updated successfully");
            } else {
                reqRes1.setStatusCode(404);
                reqRes1.setMessage("User not found for update");
            }
        } catch (Exception e){
            reqRes1.setStatusCode(500);
            reqRes1.setMessage("Error occurred while updating user: " + e.getMessage());
        }
        return reqRes1;
    }

    public ReqRes1 getMyInfo(String email) {
        ReqRes1 reqRes1 = new ReqRes1();
        //Logger logger = LoggerFactory.getLogger(getClass());
        try {
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User users = userOptional.get();
                //logger.debug("User found: {}", user);

                reqRes1 = new ReqRes1(users);
                reqRes1.setStatusCode(200);
                reqRes1.setMessage("Successful");
                System.out.println("Roles in getMyInfo: " + users.getRoles());

            } else {
                reqRes1.setStatusCode(404);
                reqRes1.setMessage("User not found");
            }
        } catch (Exception e) {
            // logger.error("Error occurred while getting user info: ", e);
            reqRes1.setStatusCode(500);
            reqRes1.setMessage("Error occurred while getting user info: " + e.getMessage());
        }

        return reqRes1;
    }

}
