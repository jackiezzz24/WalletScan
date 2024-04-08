package com.cs5500.walletscan;

import com.cs5500.walletscan.Utils.ValidationUtils;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ValidationUtilsTest {

    private final ValidationUtils validationUtils = new ValidationUtils();

    @Test
    public void testIsValidEmail_ValidEmail_ReturnsTrue() {
        String validEmail = "test@example.com";
        assertTrue(validationUtils.isValidEmail(validEmail));
    }

    @Test
    public void testIsValidEmail_InvalidEmail_ReturnsFalse() {
        String invalidEmail = "testexample.com"; // Missing '@'
        assertFalse(validationUtils.isValidEmail(invalidEmail));
    }

    @Test
    public void testIsValidPassword_ValidPassword_ReturnsTrue() {
        String validPassword = "password123";
        assertTrue(validationUtils.isValidPassword(validPassword));
    }

    @Test
    public void testIsValidPassword_InvalidPassword_ReturnsFalse() {
        String invalidPassword = "pass"; // Less than 6 characters
        assertFalse(validationUtils.isValidPassword(invalidPassword));
    }
}
