//package com.employeeDirectory.employeeDirectory.controller;
//
//import com.employeeDirectory.employeeDirectory.dto.ReqRes;
//import com.employeeDirectory.employeeDirectory.entity.OurUsers;
//import com.employeeDirectory.employeeDirectory.service.UsersManagementService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//public class UserManagementController {
//
//    @Autowired
//    private UsersManagementService usersManagementService;
//
//    @PostMapping("/auth/register")
//    public ResponseEntity<ReqRes> register(@RequestBody ReqRes reg) {
//        return ResponseEntity.ok(usersManagementService.register(reg));
//    }
//
//    @PostMapping("/auth/login")
//    public ResponseEntity<ReqRes> login(@RequestBody ReqRes req) {
//        return ResponseEntity.ok(usersManagementService.login(req));
//    }
//
//    @PostMapping("/auth/refresh")
//    public ResponseEntity<ReqRes> refreshToken(@RequestBody ReqRes req) {
//        return ResponseEntity.ok(usersManagementService.refreshToken(req));
//    }
//
//    @GetMapping("/admin/get-all-users")
//    public ResponseEntity<ReqRes> getAllUsers() {
//        return ResponseEntity.ok(usersManagementService.getAllUsers());
//    }
//
//    @GetMapping("/admin/get-users/{userId}")
//    public ResponseEntity<ReqRes> getUserById(@PathVariable Integer userId) {
//        return ResponseEntity.ok(usersManagementService.getUsersById(userId));
//    }
//
//    @PutMapping("/admin/update/{userId}")
//    public ResponseEntity<ReqRes> updateUser(@PathVariable Integer userId, @RequestBody OurUsers reqres) {
//        return ResponseEntity.ok(usersManagementService.updateUser(userId, reqres));
//    }
//
//    @GetMapping("/admin/get-profile")
//    public ResponseEntity<ReqRes> getMyProfile() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String email = authentication.getName();
//        ReqRes response = usersManagementService.getMyInfo(email);
//        return ResponseEntity.status(response.getStatusCode()).body(response);
//    }
//
//    @DeleteMapping("/admin/delete/{userId}")
//    public ResponseEntity<ReqRes> deleteUser(@PathVariable Integer userId) {
//        return ResponseEntity.ok(usersManagementService.deleteUser(userId));
//    }
//


//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("/get-all-users")
//    public ResponseEntity<ReqRes> getAllUsers() {
//        return ResponseEntity.ok(usersManagementService.getAllUsers());
//    }
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("/get-users/{userId}")
//    public ResponseEntity<ReqRes> getUserById(@PathVariable Integer userId) {
//        return ResponseEntity.ok(usersManagementService.getUsersById(userId));
//    }
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @PutMapping("/update/{userId}")
//    public ResponseEntity<ReqRes> updateUser(@PathVariable Integer userId, @RequestBody OurUsers reqres) {
//        return ResponseEntity.ok(usersManagementService.updateUser(userId, reqres));
//    }
//
//    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
//    @GetMapping("/adminuser/get-profile")
//    public ResponseEntity<ReqRes> getMyProfile() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String email = authentication.getName();
//        ReqRes response = usersManagementService.getMyInfo(email);
//        return ResponseEntity.status(response.getStatusCode()).body(response);
//    }
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @DeleteMapping("/delete/{userId}")
//    public ResponseEntity<ReqRes> deleteUser(@PathVariable Integer userId) {
//        return ResponseEntity.ok(usersManagementService.deleteUser(userId));
//    }


