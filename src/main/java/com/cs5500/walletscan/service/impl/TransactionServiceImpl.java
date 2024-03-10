package com.cs5500.walletscan.service.impl;

import com.cs5500.walletscan.dto.ResponseDto;
import com.cs5500.walletscan.dto.TransactionsDto;
import com.cs5500.walletscan.entity.Transaction;
import com.cs5500.walletscan.repository.TransactionRepository;
import com.cs5500.walletscan.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Override
    public ResponseDto add(Long userId, TransactionsDto transactionsDto) {
        ResponseDto response = new ResponseDto();
        try {
            Transaction transaction = mapDtoToEntity(transactionsDto, userId);
            Transaction savedTrans = transactionRepository.save(transaction);
            response.setTransaction(savedTrans);
            response.setMessage("Transaction Saved Successfully");
            response.setStatusCode(200);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setError(e.getMessage());
        }
        return response;
    }

    @Override
    public ResponseDto delete(Long id) {
        ResponseDto response = new ResponseDto();
            try {
                // Assuming you have a method to find a transaction by ID
                Optional<Transaction> transaction = transactionRepository.findById(id);
                // Check if the transaction exists and belongs to the specified user
                if (transaction.isPresent()) {
                    // Delete the transaction
                    transactionRepository.delete(transaction.get());
                }
                response.setMessage("Transaction deleted Successfully");
            response.setStatusCode(200);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setError(e.getMessage());
        }
        return response;
    }

    @Override
    public List<Transaction> getIncome(Long userId) {
        return transactionRepository.getIncomeByUseridAndExpensesIsFalse(userId);
    }

    @Override
    public List<Transaction> getExpense(Long userId) {
        return transactionRepository.getExpenseByUseridAndExpensesIsTrue(userId);
    }

    private Transaction mapDtoToEntity(TransactionsDto transactionsDto, Long userId) {
        Transaction transaction = new Transaction();
        transaction.setAmount(transactionsDto.getAmount());
        transaction.setDate(transactionsDto.getDate());
        transaction.setCategory(transactionsDto.getCategory());
        transaction.setExpenses(transactionsDto.getExpenses());
        transaction.setCurrency(transactionsDto.getCurrency());
        transaction.setDescription(transactionsDto.getDescription());
        transaction.setMerchant(transactionsDto.getMerchant());
        transaction.setUserid(userId);
        transaction.setReceipt_img(transactionsDto.getReceipt_img());
        return transaction;
    }
}
