package com.cs5500.walletscan.servlet;

import com.cs5500.walletscan.model.Text;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonReader;
import java.io.*;
import java.util.Arrays;
import java.util.List;

public class OCRClient {
    
    private static String API_URL = "https://vision.googleapis.com/v1/images:annotate?key=";
    private static String API_KEY = "AIzaSyDKaDElGw_F39jpvr5ngP2dZ476CDO1ktc";
    
    public String buildURL() {
        return API_URL + API_KEY;
    }
    
    public String performOCR(String url) throws OCRException {
        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(buildURL());
        httpPost.setHeader("Content-Type", "application/json");
        try {
            httpPost.setEntity(new StringEntity(createJsonRequestBody(url)));
        } catch (UnsupportedEncodingException e) {
            throw new OCRException("Failed to build entity");
        }
        try (CloseableHttpResponse response = client.execute(httpPost)) {
            String responseString = EntityUtils.toString(response.getEntity());
            try (JsonReader reader = Json.createReader(new StringReader(responseString))) {
                JsonObject jsonResponse = reader.readObject();
                JsonArray responses = jsonResponse.getJsonArray("responses");
                if (responses != null && !responses.isEmpty()) {
                    JsonObject responseObj = responses.getJsonObject(0);
                    return responseObj.getJsonArray("textAnnotations").toString();
                }
            }
        } catch (Exception e) {
            throw new OCRException("Failed to get response");
        }
        return null;
    }
    
    public List<Text> getText(String data) throws OCRException {
        if (data == null || data.length() == 0) {
            throw new OCRException("Failed to read data");
        }
        ObjectMapper mapper = new ObjectMapper();
        try {
            return Arrays.asList(mapper.readValue(data, Text[].class));
        } catch (JsonProcessingException e) {
            throw new OCRException("Failed to cast json to Text");
        }
    }
    
    public String createJsonRequestBody(String url) {
        // Create the JSON Object for the request body
        JsonObject jsonRequest = Json.createObjectBuilder()
            .add("requests", Json.createArrayBuilder()
                .add(Json.createObjectBuilder()
                    .add("image", Json.createObjectBuilder()
                        .add("source", Json.createObjectBuilder()
                                .add("imageUri", url)))
                    .add("features", Json.createArrayBuilder()
                        .add(Json.createObjectBuilder()
                            .add("type", "TEXT_DETECTION")
                        )
                    )
                )
            ).build();
    
        // Convert the JSON Object to String
        return jsonRequest.toString();
    }
}
