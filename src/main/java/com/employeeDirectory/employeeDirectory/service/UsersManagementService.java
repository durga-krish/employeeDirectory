package com.employeeDirectory.employeeDirectory.service;

import com.employeeDirectory.employeeDirectory.dto.ReqRes;
import com.employeeDirectory.employeeDirectory.entity.OurUsers;
import com.employeeDirectory.employeeDirectory.entity.Role;
import com.employeeDirectory.employeeDirectory.repository.RoleRepository;
import com.employeeDirectory.employeeDirectory.repository.UserRepository;
//import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.swing.text.html.Option;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UsersManagementService {
    private static final Logger logger = LoggerFactory.getLogger(UsersManagementService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ReqRes register(ReqRes registrationRequest){
        ReqRes resp = new ReqRes();

        try {
            logger.info("Registering user: {}", registrationRequest);

            OurUsers ourUser = new OurUsers();
            ourUser.setEmail(registrationRequest.getEmail());
            ourUser.setCity(registrationRequest.getCity());
            //ourUser.setRole(registrationRequest.getRole());
            ourUser.setName(registrationRequest.getName());
            ourUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));

            List<String> roleNames = registrationRequest.getRoles();
            if (roleNames == null || roleNames.isEmpty()) {
                throw new IllegalArgumentException("Role names must not be empty");
            }

            Set<Role> roles = new HashSet<>();
            for (String roleName : roleNames) {
                Role role = roleRepository.findByName(roleName);
                if (role == null) {
                    role = new Role();
                    role.setName(roleName);
                    role = roleRepository.save(role);
                }
                roles.add(role);
            }
            ourUser.setRoles(roles);

            OurUsers ourUsersResult = userRepository.save(ourUser);
            if (ourUsersResult.getId() > 0) {
                resp.setOurUsers(ourUsersResult);
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

    public ReqRes login(ReqRes loginRequest){
        ReqRes response = new ReqRes();

        try {
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),
                            loginRequest.getPassword()));
            var user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);

            response.setStatusCode(200);
            response.setToken(jwt);
            //response.setRole(user.getRole());
            response.setRefreshToken(refreshToken);
            response.setExpirationTime("24Hrs");
            response.setMessage("Successfully logged in");
            response.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toList()));


        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public ReqRes refreshToken(ReqRes refreshTokenRequest){
        ReqRes response = new ReqRes();
        try {
            String ourEmail = jwtUtils.extractUsername(refreshTokenRequest.getToken());
            OurUsers users = userRepository.findByEmail(ourEmail).orElseThrow();
            if (jwtUtils.isTokenValid(refreshTokenRequest.getToken(), users)){
                var jwt = jwtUtils.generateToken(users);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenRequest.getToken());
                response.setExpirationTime("24Hrs");
                response.setMessage("Successfully Refreshed Token");
            }
            response.setStatusCode(200);
            return response;
        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
            return response;

        }
    }

    public ReqRes getAllUsers(){
        ReqRes reqRes = new ReqRes();

        try {
            List<OurUsers> result = userRepository.findAll();
            if (!result.isEmpty()){
                reqRes.setOurUsersList(result);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("No users found");
            }
            return reqRes;
        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
            return reqRes;
        }
    }

    public ReqRes getUsersById(Integer id){
        ReqRes reqRes = new ReqRes();
        try {
            OurUsers usersById = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
            reqRes.setOurUsers(usersById);
            reqRes.setStatusCode(200);
            reqRes.setMessage("Users with id '" + id + "' found successfully");
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes deleteUser(Integer userId){
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                //userRepository.deleteUserRolesByUserId(userId);
                OurUsers user = userOptional.get();
                user.getRoles().clear();
               userRepository.save(user);
            userRepository.deleteById(userId);
            reqRes.setStatusCode(200);
            reqRes.setMessage("User deleted successfully");
            }else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for deletion");
            }
        }catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while deleting user: " + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes updateUser(Integer userId, OurUsers updatedUser) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                OurUsers existingUser = userOptional.get();
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setName(updatedUser.getName());
                existingUser.setCity(updatedUser.getCity());
               // existingUser.setRole(updatedUser.getRole());

                if (updatedUser.getPassword() !=null && !updatedUser.getPassword().isEmpty()) {
                    existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }

                OurUsers savedUser = userRepository.save(existingUser);
                reqRes.setOurUsers(savedUser);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User updated successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }
        } catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while updating user: " + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes getMyInfo(String email) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                OurUsers user = userOptional.get();
                reqRes = new ReqRes(user);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while getting user info: " + e.getMessage());
        }
        return reqRes;
    }
}
