package com.cs5500.walletscan;

import com.cs5500.walletscan.Utils.ValidationUtils;
import com.cs5500.walletscan.repository.SubscribeRepository;
import com.cs5500.walletscan.service.impl.SubscribeServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class SubscribeServiceImplTest {

    @Mock
    private SubscribeRepository subscribeRepository;

    @Mock
    private ValidationUtils validationUtils;

    @InjectMocks
    private SubscribeServiceImpl subscribeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void testSaveSubscribe_ValidEmail_Success() {
        String validEmail = "test@example.com";
        when(validationUtils.isValidEmail(validEmail)).thenReturn(true);

        String result = subscribeService.saveSubscribe(validEmail);

        assertEquals("Subscribe Successfully", result);
    }

    @Test
    void testSaveSubscribe_InvalidEmail_Failure() {
        String invalidEmail = "invalid_email";
        when(validationUtils.isValidEmail(invalidEmail)).thenReturn(false);

        String result = subscribeService.saveSubscribe(invalidEmail);

        assertEquals("Invalid Email Format", result);
    }
}

