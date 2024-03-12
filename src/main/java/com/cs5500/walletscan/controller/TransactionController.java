package com.cs5500.walletscan.controller;


import jakarta.annotation.Resource;
import org.apache.poi.hssf.usermodel.*;
import com.cs5500.walletscan.dto.ResponseDto;
import com.cs5500.walletscan.dto.TransactionsDto;
import com.cs5500.walletscan.entity.Transaction;
import com.cs5500.walletscan.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/transaction")
public class TransactionController {

    @Resource
    @Autowired
    private TransactionService transactionService;

    @PostMapping("/{userId}/add")
    public ResponseEntity<ResponseDto> addTransaction
            (@PathVariable Long userId, @RequestBody TransactionsDto transactionsDto){
        ResponseDto response = transactionService.add(userId, transactionsDto);

        HttpStatus httpStatus = switch (response.getStatusCode()) {
            case 200 -> HttpStatus.OK;
            case 400 -> HttpStatus.BAD_REQUEST;
            default -> HttpStatus.INTERNAL_SERVER_ERROR;
        };

        return new ResponseEntity<>(response, httpStatus);
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<ResponseDto> deleteTransaction
            (@PathVariable Long id){
        ResponseDto response = transactionService.delete(id);
        HttpStatus httpStatus = switch (response.getStatusCode()) {
            case 200 -> HttpStatus.OK;
            case 400 -> HttpStatus.BAD_REQUEST;
            default -> HttpStatus.INTERNAL_SERVER_ERROR;
        };

        return new ResponseEntity<>(response, httpStatus);
    }

    @GetMapping("/incomes/{userid}")
    public List<Transaction> getAllIncomesForUser(@PathVariable Long userid) {
        return transactionService.getIncome(userid);
    }

    @GetMapping("/expenses/{userid}")
    public List<Transaction> getAllExpensesForUser(@PathVariable Long userid) {
        return transactionService.getExpense(userid);
    }

    @RequestMapping(value = "UserExcelDownloads", method = RequestMethod.GET)
    public void downloadAllClassmate(HttpServletResponse response) throws IOException {
        HSSFWorkbook workbook = new HSSFWorkbook();// Create HSSFWorkbook object, excel's document object
        HSSFSheet sheet = workbook.createSheet("report"); // Excel's form

        List<Transaction> alltransList = transactionService.alltrans();

        String fileName = "transactions.csv";// Set the name of the file to be exported
        // Add data rows and set cell data
        int rowNum = 1;
        String[] headers = { "Date", "Category", "Merchant", "Currency", "Amount" };
        // headers represent the header of the first row in the excel table
        HSSFRow row = sheet.createRow(0);
        // Add header to the excel table
        for(int i = 0; i < headers.length; i++){
            HSSFCell cell = row.createCell(i);
            HSSFRichTextString text = new HSSFRichTextString(headers[i]);
            cell.setCellValue(text);
        }

        // Add queried data to the corresponding columns in the table
        for (Transaction transaction : alltransList) {
            HSSFRow row1 = sheet.createRow(rowNum);
            row1.createCell(0).setCellValue(transaction.getDate());
            row1.createCell(1).setCellValue(transaction.getCategory());
            row1.createCell(2).setCellValue(transaction.getMerchant());
            row1.createCell(3).setCellValue(transaction.getCurrency());
            row1.createCell(4).setCellValue(transaction.getAmount());
            rowNum++;
        }

        // Set the Content-Type to "text/csv"
        response.setContentType("text/csv");
        // Set the header to specify the file name for the download
        response.setHeader("Content-disposition", "attachment;filename=" + fileName);
        response.flushBuffer();
        workbook.write(response.getOutputStream());
    }

}
