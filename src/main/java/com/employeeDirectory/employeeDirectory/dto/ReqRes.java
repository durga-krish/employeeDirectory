//package com.employeeDirectory.employeeDirectory.dto;
//
//import com.employeeDirectory.employeeDirectory.entity.OurUsers;
//import com.employeeDirectory.employeeDirectory.entity.Role;
//import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
//import com.fasterxml.jackson.annotation.JsonInclude;
//import lombok.Data;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Data
//@JsonInclude(JsonInclude.Include.NON_NULL)
//@JsonIgnoreProperties(ignoreUnknown = true)
//public class ReqRes {
//
//    private int statusCode;
//    private String error;
//    private String message;
//    private String token;
//    private String refreshToken;
//    private String expirationTime;
//    private String name;
//    private String city;
//    private String email;
//    private String password;
//    private OurUsers ourUsers;
//    private List<OurUsers> ourUsersList;
//    private List<String> roles;
//
//    public ReqRes(){
//
//    }
//
//    public ReqRes(OurUsers ourUsers) {
//        this.ourUsers = ourUsers;
//        this.name = ourUsers.getName();
//        this.city = ourUsers.getCity();
//        this.email = ourUsers.getEmail();
//        this.roles = ourUsers.getRoles().stream()
//                .map(Role::getName)
//                .collect(Collectors.toList());
//        System.out.println("Roles in ReqRes constructor: " + this.roles);
//
//    }
//
//
//    public List<String> getRoles() {
//        return roles;
//    }
//
//    public void setRoles(List<String> roles) {
//        this.roles = roles;
//    }
//
//}
