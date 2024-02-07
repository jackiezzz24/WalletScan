package com.cs5500.walletscan.servlet;

import com.fasterxml.jackson.databind.util.JSONPObject;
import org.apache.http.HttpEntity;
import org.apache.http.client.ResponseHandler;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import javax.json.Json;
import javax.json.JsonObject;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;

public class OCRClient {
    
    private static String API_URL = "https://vision.googleapis.com/v1/images:annotate?key=";
    private static String API_KEY = "AIzaSyDKaDElGw_F39jpvr5ngP2dZ476CDO1ktc";
    
    private String buildURL() {
        return API_URL + API_KEY;
    }
    
    public void imageScan(String base64Image, HttpServletResponse response) throws OCRException, MalformedURLException {
        URL url = new URL(buildURL());
        HttpURLConnection connection;
        try {
            connection = (HttpURLConnection) url.openConnection();
        } catch (IOException e) {
            throw new OCRException("Failed to connect to internet");
        }
        try {
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);
        } catch (ProtocolException e) {
            throw new OCRException("Failed to set request method");
        }
        // Create the JSON request body using the base64 encoded image
        JsonObject jsonRequest = Json.createObjectBuilder()
            .add("requests", Json.createArrayBuilder()
                .add(Json.createObjectBuilder()
                    .add("image", Json.createObjectBuilder()
                        .add("content", base64Image))
                    .add("features", Json.createArrayBuilder()
                        .add(Json.createObjectBuilder()
                            .add("type", "TEXT_DETECTION"))))
            ).build();
        // Write the JSON request body
        try (DataOutputStream wr = new DataOutputStream(connection.getOutputStream())) {
            wr.write(jsonRequest.toString().getBytes());
        } catch (IOException e) {
            throw new OCRException("Failed to read and write output from stream");
        }
        
        // Read the response
        StringBuilder responseString = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                responseString.append(line);
            }
        } catch (IOException e) {
            throw new OCRException("Failed to read response");
        }
        // Output the response for demonstration
        response.setContentType("application/json");
        try {
            response.getWriter().println(responseString.toString());
        } catch (IOException e) {
            throw new OCRException("Failed to write response");
        }
    }
}
