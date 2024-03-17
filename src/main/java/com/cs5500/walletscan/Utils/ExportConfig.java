package com.cs5500.walletscan.Utils;


import com.cs5500.walletscan.entity.Transaction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExportConfig {

    private int sheetIndex;

    private int startRow;

    private Class dataClazz;

    private List<CellConfig> cellExportConfigList;


    public static final ExportConfig customerExport;
    static{
        customerExport = new ExportConfig();
        customerExport.setSheetIndex(0);
        customerExport.setStartRow(1);
        customerExport.setDataClazz(Transaction.class);
        List<CellConfig> customerCellConfig = new ArrayList<>();
        customerCellConfig.add(new CellConfig(0, "1"));
        customerCellConfig.add(new CellConfig(1, "2"));
        customerCellConfig.add(new CellConfig(2, "3"));
        customerCellConfig.add(new CellConfig(3, "4"));
        customerCellConfig.add(new CellConfig(4, "5"));
        customerCellConfig.add(new CellConfig(5, "6"));
        customerCellConfig.add(new CellConfig(6, "7"));
        customerCellConfig.add(new CellConfig(7, "8"));
        customerCellConfig.add(new CellConfig(8, "9"));
        customerCellConfig.add(new CellConfig(9, "10"));


        customerExport.setCellExportConfigList(customerCellConfig);
    }

}
