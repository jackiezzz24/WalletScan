package com.cs5500.walletscan.controller;

import com.cs5500.walletscan.dto.SubscribesDto;
import com.cs5500.walletscan.service.SubscribeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin
@RequestMapping("/api/subscribe")
public class SubscribeController {

    @Autowired
    SubscribeService subscribeService;

    @PostMapping("/save")
    public ResponseEntity<Map<String, String >> subscribe(@RequestBody SubscribesDto subscribesDto){
        String result = subscribeService.saveSubscribe(subscribesDto.getEmail());
        if ("Subscribe Successfully".equals(result)) {
            return ResponseEntity.status(HttpStatus.OK).body(Collections.singletonMap("message", result));

        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("error", result));

        }
    }
}
