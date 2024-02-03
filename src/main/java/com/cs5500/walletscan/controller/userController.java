package com.cs5500.walletscan.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class userController {
    @GetMapping("/api/hello")
    public String hello() {
        return "Hello\n";
    }
}
