package com.cs5500.walletscan;

import com.cs5500.walletscan.controller.TransactionController;
import com.cs5500.walletscan.dto.ResponseDto;
import com.cs5500.walletscan.dto.TransactionsDto;
import com.cs5500.walletscan.entity.Transaction;
import com.cs5500.walletscan.repository.TransactionRepository;
import com.cs5500.walletscan.service.TransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

public class TransactionControllerTest {

    @Mock
    private TransactionService transactionService;

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private TransactionController transactionController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void testAddTransaction() {
        TransactionsDto transactionsDto = new TransactionsDto();
        transactionsDto.setAmount("100.0");
        transactionsDto.setCategory("Groceries");

        ResponseDto responseDto = new ResponseDto();
        responseDto.setStatusCode(200);
        responseDto.setMessage("Transaction added successfully");

        when(transactionService.add(anyLong(), any(TransactionsDto.class))).thenReturn(responseDto);

        ResponseEntity<ResponseDto> responseEntity = transactionController.addTransaction(1L, transactionsDto);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(responseDto, responseEntity.getBody());
    }

    @Test
    void testDeleteTransaction() {
        ResponseDto responseDto = new ResponseDto();
        responseDto.setStatusCode(200);
        responseDto.setMessage("Transaction deleted successfully");

        when(transactionService.delete(anyLong())).thenReturn(responseDto);

        ResponseEntity<ResponseDto> responseEntity = transactionController.deleteTransaction(1L);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(responseDto, responseEntity.getBody());
    }

    @Test
    void testGetAllIncomesForUser() {
        List<Transaction> transactions = Collections.singletonList(new Transaction());
        when(transactionService.getIncome(anyLong())).thenReturn(transactions);

        List<Transaction> result = transactionController.getAllIncomesForUser(1L);

        assertEquals(transactions, result);
    }

    @Test
    void testGetAllExpensesForUser() {
        List<Transaction> transactions = Collections.singletonList(new Transaction());
        when(transactionService.getExpense(anyLong())).thenReturn(transactions);

        List<Transaction> result = transactionController.getAllExpensesForUser(1L);

        assertEquals(transactions, result);
    }

    @Test
    void testExportToExcel() {
        Long userId = 1L;
        List<Transaction> transactions = new ArrayList<>();
        when(transactionRepository.findAllByUserid(userId)).thenReturn(transactions);

        ResponseEntity<?> responseEntity = transactionController.exportToExcel(userId);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals("application/vnd.ms-excel", responseEntity.getHeaders().getContentType().toString());
        String filenameHeader = responseEntity.getHeaders().getContentDisposition().getFilename();
        // Remove double quotes if present
        filenameHeader = filenameHeader.replaceAll("\"", "");

        assertEquals("transactions.xlsx", filenameHeader);

    }
}

