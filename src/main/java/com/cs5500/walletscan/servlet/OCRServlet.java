package com.cs5500.walletscan.servlet;

import com.cs5500.walletscan.Utils.WallestScanUtils;
import com.cs5500.walletscan.model.Text;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.util.List;

@WebServlet(name="OCRServlet", urlPatterns = {"/ocr"})
public class OCRServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.getWriter().println("Hello World!");
    }
    
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        OCRClient client = new OCRClient();
        List<Text> texts;
        try {
            InputStream inputStream = getClass().getResourceAsStream("/testImage/receipt.jpg");
            File file = new File(getClass().getResource("/testImage/receipt.jpg").toURI());
            String base64String = WallestScanUtils.encodeImageToBase64String(file);
            texts = client.getText(client.performOCR(base64String));
        } catch (URISyntaxException e) {
            throw new OCRException("Failed to read file");
        }
    }
}
