package com.cs5500.walletscan;

import com.cs5500.walletscan.model.Text;
import com.cs5500.walletscan.servlet.OCRClient;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.util.EntityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import java.io.IOException;
import java.io.StringReader;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;


public class OCRClientTest {

    private CloseableHttpClient httpClient;
    private OCRClient ocrClient;

    @BeforeEach
    public void setup() {
        httpClient = Mockito.mock(CloseableHttpClient.class);
        ocrClient = new OCRClient();
    }

    @Test
    public void testPerformOCR_ValidResponse_ReturnsExpectedText() throws IOException {
        // Prepare test data
        String url = "https://example.com/image.jpg";
        String jsonResponse = "{\"responses\":[{\"textAnnotations\":[\"Some Text\"]}]}";

        // Mock HTTP client response
        CloseableHttpResponse httpResponse = Mockito.mock(CloseableHttpResponse.class);
        HttpEntity httpEntity = new StringEntity(jsonResponse);
        when(httpResponse.getEntity()).thenReturn(httpEntity);
        when(httpClient.execute(Mockito.any(HttpPost.class))).thenReturn(httpResponse);

        // Perform OCR
        String actualText = ocrClient.performOCR(url);

        // Verify the result
        assertEquals("Some Text", actualText);
    }

    @Test
    public void testPerformOCR_IOExceptionThrown_ExceptionHandled() throws IOException {
        // Mock IOException thrown when executing the HTTP request
        when(httpClient.execute(any(HttpPost.class))).thenThrow(IOException.class);

        // Perform OCR on a valid URL
        String result = ocrClient.performOCR("https://example.com/image.jpg");

        // Verify that null is returned due to exception handling
        assertNull(result);
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

    @Test
    public void testGetText_JsonProcessingExceptionThrown_ExceptionHandled() {
        // Mock JsonProcessingException thrown during JSON parsing
        ObjectMapper objectMapper = mock(ObjectMapper.class);
        when(objectMapper.readValue(anyString(), eq(Text[].class))).thenThrow(JsonProcessingException.class);

        // Perform conversion to list of Text objects
        List<Text> textList = ocrClient.getText("invalid_json_data");

        // Verify that null is returned due to exception handling
        assertNull(textList);
    }

    // Helper class to mock CloseableHttpResponse
    private static class TestHttpEntity extends org.apache.http.entity.ByteArrayEntity {
        public TestHttpEntity(String data) {
            super(data.getBytes());
        }
    }
}