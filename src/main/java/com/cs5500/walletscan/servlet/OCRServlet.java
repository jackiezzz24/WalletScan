package com.cs5500.walletscan.servlet;

import com.cs5500.walletscan.Utils.WallestScanUtils;
import com.cs5500.walletscan.entity.Receipt;
import com.cs5500.walletscan.model.Text;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.cloudinary.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet(name = "OCRServlet", urlPatterns = { "/api/ocr" })
public class OCRServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // Ensure the content type is application/json
        if (!req.getContentType().equalsIgnoreCase("application/json")) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid content type. Application/json required.");
            return;
        }

        // Read JSON from the request body
        StringBuilder jsonBuffer = new StringBuilder();
        String line;
        try (BufferedReader reader = req.getReader()) {
            while ((line = reader.readLine()) != null) {
                jsonBuffer.append(line);
            }
        } catch (IOException e) {
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error reading JSON request body.");
            return;
        }

        String json = jsonBuffer.toString();
        JSONObject jsonObject = new JSONObject(json);
        String url = jsonObject.getString("url"); // Directly get the string value for "url"

        if (url == null || url.isEmpty()) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "URL parameter is missing in JSON body.");
            return;
        }

        OCRClient client = new OCRClient();
        List<Text> texts;
        texts = client.getText(client.performOCR(url));
        Receipt receipt = WallestScanUtils.readTextToReceipt(texts);
        JSONObject res = new JSONObject();
        res.put("merchant", receipt.getStoreName());
        res.put("amount", receipt.getTotal() + "");
        res.put("date", receipt.getDate());

        // Set content type
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();
        out.println(res.toString());
        out.close();
    }
}
