package com.cs5500.walletscan;

import com.cs5500.walletscan.dto.ResponseDto;
import com.cs5500.walletscan.dto.TransactionsDto;
import com.cs5500.walletscan.entity.Transaction;
import com.cs5500.walletscan.repository.TransactionRepository;
import com.cs5500.walletscan.service.impl.TransactionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

class TransactionServiceImplTest {

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private TransactionServiceImpl transactionService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void testAdd_ValidTransaction_Success() {
        Transaction savedTransaction = new Transaction();
        when(transactionRepository.save(any(Transaction.class))).thenReturn(savedTransaction);

        ResponseDto response = transactionService.add(1L, new TransactionsDto());

        assertEquals("Transaction Saved Successfully", response.getMessage());
        assertEquals(200, response.getStatusCode());
        assertEquals(savedTransaction, response.getTransaction());
    }

    @Test
    void testDelete_ExistingTransaction_Success() {
        Transaction existingTransaction = new Transaction();
        when(transactionRepository.findById(anyLong())).thenReturn(Optional.of(existingTransaction));

        ResponseDto response = transactionService.delete(1L);

        assertEquals("Transaction deleted Successfully", response.getMessage());
        assertEquals(200, response.getStatusCode());
    }

    @Test
    void testGetIncome_ValidUserId_Success() {
        List<Transaction> incomeTransactions = new ArrayList<>();
        when(transactionRepository.getIncomeByUseridAndExpensesIsFalse(anyLong())).thenReturn(incomeTransactions);

        List<Transaction> result = transactionService.getIncome(1L);

        assertEquals(incomeTransactions, result);
    }

    @Test
    void testGetExpense_ValidUserId_Success() {
        List<Transaction> expenseTransactions = new ArrayList<>();
        when(transactionRepository.getExpenseByUseridAndExpensesIsTrue(anyLong())).thenReturn(expenseTransactions);

        List<Transaction> result = transactionService.getExpense(1L);

        assertEquals(expenseTransactions, result);
    }
}
