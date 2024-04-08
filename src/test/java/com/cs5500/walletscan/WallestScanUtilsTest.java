package com.cs5500.walletscan;

import com.cs5500.walletscan.Utils.WallestScanUtils;
import com.cs5500.walletscan.entity.Receipt;
import com.cs5500.walletscan.model.Text;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class WallestScanUtilsTest {

    @Test
    public void testReadTextToReceipt_ValidTexts_ReturnsExpectedReceipt() {
        List<Text> texts = new ArrayList<>();
        texts.add(new Text.Builder().description("Merchant").build());
        texts.add(new Text.Builder().description("Store Name").build());
        texts.add(new Text.Builder().description("TOTAL").build());
        texts.add(new Text.Builder().description("100").build());
        texts.add(new Text.Builder().description("10/05/2024").build());

        Receipt receipt = WallestScanUtils.readTextToReceipt(texts);

        assertEquals("Store Name", receipt.getStoreName());
        assertEquals(100.0, receipt.getTotal());
        assertEquals("10/05/2024", receipt.getDate());
    }
}
