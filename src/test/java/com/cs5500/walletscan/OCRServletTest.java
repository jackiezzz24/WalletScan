package com.cs5500.walletscan;

import com.cs5500.walletscan.model.Text;
import com.cs5500.walletscan.servlet.OCRClient;
import com.cs5500.walletscan.servlet.OCRServlet;
import org.json.JSONObject;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.PrintWriter;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class OCRServletTest {

    @Test
    public void testDoPost_ValidRequest_ReturnsExpectedResponse() throws Exception {
        // Prepare a mock request with a valid JSON body
        String jsonRequest = "{\"url\": \"https://example.com/image.jpg\"}";
        HttpServletRequest request = Mockito.mock(HttpServletRequest.class);
        when(request.getContentType()).thenReturn("application/json");
        BufferedReader reader = new BufferedReader(new StringReader(jsonRequest));
        when(request.getReader()).thenReturn(reader);

        // Prepare a mock response
        HttpServletResponse response = Mockito.mock(HttpServletResponse.class);
        StringWriter stringWriter = new StringWriter();
        PrintWriter writer = new PrintWriter(stringWriter);
        when(response.getWriter()).thenReturn(writer);

        // Mock OCRClient behavior
        OCRClient client = Mockito.mock(OCRClient.class);
        List<Text> texts = new ArrayList<>();
        texts.add(new Text.Builder().description("Store Name").build());
        texts.add(new Text.Builder().description("TOTAL").build());
        texts.add(new Text.Builder().description("100").build());
        texts.add(new Text.Builder().description("10/05/2024").build());

        // Mocking the behavior of performOCR method to return a JSON response
        Mockito.when(client.performOCR("https://example.com/image.jpg")).thenReturn("{\"text\": \"Some text\"}");
        Mockito.when(client.getText("Some text")).thenReturn(texts);

        // Call doPost method
        OCRServlet servlet = new OCRServlet();
        servlet.doPost(request, response);

        // Verify the response
        JSONObject expectedResponse = new JSONObject();
        expectedResponse.put("merchant", "Store Name");
        expectedResponse.put("amount", "100.0");
        expectedResponse.put("date", "10/05/2024");
        assertEquals(expectedResponse.toString(), stringWriter.toString().trim());
    }
}
