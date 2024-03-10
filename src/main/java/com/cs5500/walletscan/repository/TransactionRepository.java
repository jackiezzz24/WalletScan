package com.cs5500.walletscan.repository;

import com.cs5500.walletscan.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;

@EnableJpaRepositories
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> getIncomeByUseridAndExpensesIsFalse (Long userId);
    List<Transaction> getExpenseByUseridAndExpensesIsTrue (Long userId);
}

