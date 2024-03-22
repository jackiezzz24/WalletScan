package com.cs5500.walletscan.service;

import com.cs5500.walletscan.dto.ResponseDto;
import com.cs5500.walletscan.dto.TransactionsDto;
import com.cs5500.walletscan.entity.Transaction;
import java.util.List;

public interface TransactionService {
    ResponseDto add(Long userId, TransactionsDto transactionsDto);
    List<Transaction> getIncome(Long userId);
    List<Transaction> getExpense(Long userId);
    ResponseDto delete(Long id);

}
