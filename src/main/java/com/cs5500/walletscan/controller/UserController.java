package com.cs5500.walletscan.controller;

import com.cs5500.walletscan.Dto.UserDto;
import com.cs5500.walletscan.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api")
public class UserController {

    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("")
    public String viewHomePage() {
        return "home";
    }

    @PostMapping ("/register")
    public void registerUser(@RequestBody UserDto userDto) {
        userService.registerUser(userDto);
    }
}