package com.cs5500.walletscan.controller;


import com.cs5500.walletscan.Utils.ExcelUtils;
import com.cs5500.walletscan.repository.TransactionRepository;
import com.cs5500.walletscan.service.UserService;
import jakarta.annotation.Resource;
import com.cs5500.walletscan.dto.ResponseDto;
import com.cs5500.walletscan.dto.TransactionsDto;
import com.cs5500.walletscan.entity.Transaction;
import com.cs5500.walletscan.service.TransactionService;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;


@RestController
@CrossOrigin
@RequestMapping("/api/transaction")
public class TransactionController {

    @Resource
    @Autowired
    private TransactionService transactionService;
    private TransactionRepository transactionRepository;
    private UserService userService;



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


    //导出为Excel

    @GetMapping("/export")
    public ResponseEntity<org.springframework.core.io.Resource> export() throws Exception {
        List<Transaction> transactions = transactionRepository.findAll();

        if (!CollectionUtils.isEmpty(transactions)) {
            String fileName = "Transactions Export" + ".xlsx";

            ByteArrayInputStream in = ExcelUtils.exportCustomer(transactions, fileName);

            InputStreamResource inputStreamResource = new InputStreamResource(in);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=" + URLEncoder.encode(fileName, StandardCharsets.UTF_8)
                    )
                    .contentType(MediaType.parseMediaType("application/vnd.ms-excel; charset=UTF-8"))
                    .body(inputStreamResource);
        } else {
            throw new Exception("No data");

        }
    }

}
