package com.cs5500.walletscan.Utils;

import com.cs5500.walletscan.entity.Receipt;
import com.cs5500.walletscan.model.Text;
import java.util.List;

public class WallestScanUtils {
    
//    public static String encodeImageToBase64String(File file) throws IOException {
//        try {
//            byte[] fileContent = Files.readAllBytes(file.toPath());
//            return Base64.getEncoder().encodeToString(fileContent);
//        } catch (FileNotFoundException e) {
//            System.err.println("File not found: " + e.getMessage());
//            // Handle the case where the file isn't found, e.g., return null or a default value
//        } catch (IOException e) {
//            System.err.println("Error reading file: " + e.getMessage());
//            // Handle other I/O error cases here
//        } catch (OutOfMemoryError e) {
//            System.err.println("File too large to process: " + e.getMessage());
//            // Handle the case where the file is too large
//        }
//        return null; // or some other appropriate error value
//    }

    public static Receipt readTextToReceipt(List<Text> texts) {
        String storeName = texts.get(1).getDescription();
        double total = 0.0;
        String date = "";
        for (int i = 2; i < texts.size(); i++) {
            if (texts.get(i).getDescription().equalsIgnoreCase("TOTAL")) {
                String getTotal = texts.get(i + 1).getDescription().replaceAll(",", "");
                if (getTotal.contains(".")) {
                    total = Double.parseDouble(getTotal);
                } else {
                    total = Integer.parseInt(getTotal);
                }
            }
            if (texts.get(i).getDescription().contains("/")) {
                date = texts.get(i).getDescription();
            }
        }
        return new Receipt.Builder().storeName(storeName).total(total).date(date).build();
    }
}
