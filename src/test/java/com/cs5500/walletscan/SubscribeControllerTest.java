package com.cs5500.walletscan;

import com.cs5500.walletscan.controller.SubscribeController;
import com.cs5500.walletscan.dto.SubscribesDto;
import com.cs5500.walletscan.service.SubscribeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class SubscribeControllerTest {

    @Mock
    private SubscribeService subscribeService;

    @InjectMocks
    private SubscribeController subscribeController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void testSubscribe_Success() {
        SubscribesDto subscribesDto = new SubscribesDto();
        subscribesDto.setEmail("test@example.com");

        when(subscribeService.saveSubscribe(any())).thenReturn("Subscribe Successfully");

        ResponseEntity<Map<String, String>> responseEntity = subscribeController.subscribe(subscribesDto);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals("Subscribe Successfully", Objects.requireNonNull(responseEntity.getBody()).get("message"));
    }

    @Test
    void testSubscribe_Failure() {
        SubscribesDto subscribesDto = new SubscribesDto();
        subscribesDto.setEmail("test@example.com");

        when(subscribeService.saveSubscribe(any())).thenReturn("Error occurred while subscribing");

        ResponseEntity<Map<String, String>> responseEntity = subscribeController.subscribe(subscribesDto);

        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertEquals("Error occurred while subscribing", Objects.requireNonNull(responseEntity.getBody()).get("error"));
    }
}
