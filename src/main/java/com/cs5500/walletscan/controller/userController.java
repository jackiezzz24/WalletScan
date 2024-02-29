package com.cs5500.walletscan.controller;

import com.cs5500.walletscan.dto.LoginDto;
import com.cs5500.walletscan.dto.UserDto;
import com.cs5500.walletscan.entity.User;
import com.cs5500.walletscan.responseModels.LoginResponse;
import com.cs5500.walletscan.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("api/users")
public class userController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User registerUser(@RequestBody UserDto userDto) {
        return userService.addUser(userDto);
    }

    @PostMapping("/signin")
    public ResponseEntity<?> loginUser(@RequestBody LoginDto loginDto) {
        LoginResponse loginResponse = userService.loginUser(loginDto);
        return ResponseEntity.ok(loginResponse);
    }
}
