package com.cs5500.walletscan.Utils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;

public class WallestScanUtils {
    
    public static String encodeImageToBase64String(File file) throws IOException {
        try {
            byte[] fileContent = Files.readAllBytes(file.toPath());
            return Base64.getEncoder().encodeToString(fileContent);
        } catch (FileNotFoundException e) {
            System.err.println("File not found: " + e.getMessage());
            // Handle the case where the file isn't found, e.g., return null or a default value
        } catch (IOException e) {
            System.err.println("Error reading file: " + e.getMessage());
            // Handle other I/O error cases here
        } catch (OutOfMemoryError e) {
            System.err.println("File too large to process: " + e.getMessage());
            // Handle the case where the file is too large
        }
        return null; // or some other appropriate error value
    }
}
