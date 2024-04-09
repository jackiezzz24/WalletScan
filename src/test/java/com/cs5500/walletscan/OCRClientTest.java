package com.cs5500.walletscan;

import com.cs5500.walletscan.model.Text;
import com.cs5500.walletscan.servlet.OCRClient;
import com.cs5500.walletscan.servlet.OCRException;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.util.EntityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import java.io.IOException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;


public class OCRClientTest {

    private CloseableHttpClient httpClient;
    private OCRClient ocrClient;

    private String imageUrl;

    @BeforeEach
    public void setup() {
        httpClient = Mockito.mock(CloseableHttpClient.class);
        ocrClient = new OCRClient();
        imageUrl = "https://res.cloudinary.com/dxhu2wrmc/image/upload/v1711075590/receipt01_v6ouxn.png";
    }

    @Test
    public void testPerformOCR_ValidResponse_ReturnsExpectedText() throws IOException {

        try {
            String result = ocrClient.performOCR(imageUrl);
            assertNotNull(result);
            // Add more assertions if needed based on expected JSON response structure
        } catch (OCRException e) {
            fail("Failed to perform OCR: " + e.getMessage());
        }
    }

    @Test
    public void testGetText_ValidData_ReturnsTextList() {
        // Mock JSON data returned from OCR API
        String jsonData = "[{\"description\":\"Sample text\"}]";

        // Perform conversion to list of Text objects
        List<Text> textList = ocrClient.getText(jsonData);

        // Verify that the correct list of Text objects is returned
        assertEquals(1, textList.size());
        assertEquals("Sample text", textList.get(0).getDescription());
    }

}