package com.cs5500.walletscan;

import com.cs5500.walletscan.servlet.OCRException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

public class OCRExceptionTest {

    @Test
    public void testConstructor_MessageProvided_ShouldSetErrorMessage() {
        String errorMessage = "Test error message";
        OCRException exception = new OCRException(errorMessage);
        assertEquals(errorMessage, exception.getMessage());
    }

    @Test
    public void testConstructor_NullMessage_ShouldSetNullMessage() {
        OCRException exception = new OCRException(null);
        assertNull(exception.getMessage());
    }

    @Test
    public void testConstructor_EmptyMessage_ShouldSetEmptyMessage() {
        OCRException exception = new OCRException("");
        assertEquals("", exception.getMessage());
    }
}
