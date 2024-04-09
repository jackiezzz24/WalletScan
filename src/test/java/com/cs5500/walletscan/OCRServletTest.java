package com.cs5500.walletscan;

import com.cs5500.walletscan.model.Text;
import com.cs5500.walletscan.servlet.OCRClient;
import com.cs5500.walletscan.servlet.OCRServlet;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class OCRServletTest {

    @Mock
    HttpServletRequest mockRequest;

    @Mock
    HttpServletResponse mockResponse;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testDoPost_withValidUrl() throws IOException, ServletException {
        String jsonString = "{\"url\": \"https://res.cloudinary.com/dxhu2wrmc/image/upload/v1711075590/receipt01_v6ouxn.png\"}";
        when(mockRequest.getContentType()).thenReturn("application/json");
        BufferedReader reader = new BufferedReader(new StringReader(jsonString));
        when(mockRequest.getReader()).thenReturn(reader);

        StringWriter stringWriter = new StringWriter();
        PrintWriter writer = new PrintWriter(stringWriter);
        when(mockResponse.getWriter()).thenReturn(writer);

        OCRClient mockClient = mock(OCRClient.class);
        List<Text> mockTexts = Arrays.asList(
                new Text.Builder().description("Sample Store").build(),
                new Text.Builder().description("TOTAL").build(),
                new Text.Builder().description("10.0").build(),
                new Text.Builder().description("2024-04-08").build()
        );
        when(mockClient.performOCR(anyString())).thenReturn("{\"responses\": [{\"textAnnotations\": [{\"description\": \"Sample Text\"}]}]}");
        when(mockClient.getText(anyString())).thenReturn(mockTexts);

        OCRServlet servlet = new OCRServlet();
        servlet.doPost(mockRequest, mockResponse);

        String capturedResponse = stringWriter.toString();

        assertTrue(capturedResponse.contains("OTARGET"));
        assertTrue(capturedResponse.contains("585.74"));
    }
}