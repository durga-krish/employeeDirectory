package com.employeeDirectory.employeeDirectory.controller;


import com.employeeDirectory.employeeDirectory.dto.ReqRes1;
import com.employeeDirectory.employeeDirectory.entity.User;
import com.employeeDirectory.employeeDirectory.service.JWTUtils;
import com.employeeDirectory.employeeDirectory.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTUtils jwtUtils;

    static class ReqRes {
        private List<ReqRes1> users;

        public ReqRes(List<ReqRes1> users) {
            this.users = users;
        }

        public List<ReqRes1> getUsers() {
            return users;
        }
        public void setUsers(List<ReqRes1> users) {
            this.users = users;
        }
    }

    @PostMapping("/auth/register")
    public ResponseEntity<ReqRes1> register(@RequestBody ReqRes1 registrationRequest) {
        ReqRes1 response = userService.registerUser(registrationRequest);
        return new ResponseEntity<>(response, HttpStatus.valueOf(response.getStatusCode()));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<ReqRes1> loginUser(@RequestBody ReqRes1 loginRequest) {
        return ResponseEntity.ok(userService.loginUser(loginRequest));
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<ReqRes1> refreshToken(@RequestBody ReqRes1 req){
        return ResponseEntity.ok(userService.refreshToken(req));
    }

    @GetMapping("/api/users")
    public ResponseEntity<ReqRes> getUsers() {
        List<ReqRes1> userList = userService.getAllUsers();
        ReqRes response = new ReqRes(userList);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/api/users/{userId}")
    public ResponseEntity<ReqRes1> getUserById(@PathVariable Integer userId) {
        return ResponseEntity.ok(userService.getUsersById(userId));
    }

    @PutMapping("/api/users/{userId}")
    public ResponseEntity<ReqRes1> updateUser(@PathVariable Integer userId, @RequestBody User reqres) {
        return ResponseEntity.ok(userService.updateUser(userId, reqres));
    }

    @GetMapping("/api/users/get-profile")
    public ResponseEntity<ReqRes1> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ReqRes1 response = userService.getMyInfo(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/api/users/{userId}")
    public ResponseEntity<ReqRes1> deleteUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(userService.deleteUser(userId));
    }
}
