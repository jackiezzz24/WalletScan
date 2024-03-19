package com.cs5500.walletscan.controller;

import com.cs5500.walletscan.repository.TransactionRepository;
import com.cs5500.walletscan.dto.ResponseDto;
import com.cs5500.walletscan.dto.TransactionsDto;
import com.cs5500.walletscan.entity.Transaction;
import com.cs5500.walletscan.service.TransactionService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import org.springframework.core.io.Resource;


@RestController
@CrossOrigin
@RequestMapping("/api/transaction")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;
    @Autowired
    private TransactionRepository transactionRepository;

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

    @GetMapping("/export/{userid}")
    public ResponseEntity<Resource> exportToExcel(@PathVariable Long userid) {
        try {
            List<Transaction> transactions = transactionRepository.findAllByUserid(userid);

            byte[] excelBytes = convertToExcel(transactions);

            ByteArrayResource resource = new ByteArrayResource(excelBytes);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.xlsx")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    private byte[] convertToExcel(List<Transaction> transactions) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Transactions");
            CreationHelper creationHelper = workbook.getCreationHelper();
            short dateFormat = creationHelper.createDataFormat().getFormat("yyyy-MM-dd");

            // Create header row
            Row headerRow = sheet.createRow(0);
            String[] headers = {"User Id", "Transaction ID", "Date", "Category", "Merchant",
                    "Currency", "Is Expenses", "Amount", "Description"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            // Create data rows
            int rowNum = 1;
            for (Transaction transaction : transactions) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(transaction.getUserid());
                row.createCell(1).setCellValue(transaction.getId());
                Cell dateCell = row.createCell(2);
                dateCell.setCellValue(transaction.getDate());
                dateCell.setCellStyle(createDateCellStyle(workbook)); // Apply date format
                row.createCell(3).setCellValue(transaction.getCategory());
                row.createCell(4).setCellValue(transaction.getMerchant());
                row.createCell(5).setCellValue(transaction.getCurrency());
                row.createCell(6).setCellValue(transaction.getExpenses());
                row.createCell(7).setCellValue(transaction.getAmount());
                row.createCell(8).setCellValue(transaction.getDescription());
            }

            // Write workbook to ByteArrayOutputStream
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    private CellStyle createDateCellStyle(Workbook workbook) {
        CellStyle cellStyle = workbook.createCellStyle();
        cellStyle.setDataFormat(workbook.getCreationHelper().createDataFormat().getFormat("yyyy-MM-dd"));
        return cellStyle;
    }
}


