package com.misogi.budgetsplit.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.misogi.budgetsplit.model.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByGroupIdAndIsDeletedFalse(Long groupId);
    
	List<Expense> findByGroupId(Long groupId);
    
    
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.paidBy.id = :userId and e.isDeleted=false")
    Optional<BigDecimal> sumPaidAmountByUser(@Param("userId") Long userId);

    @Query("SELECT e.date, SUM(e.amount) FROM Expense e WHERE e.paidBy.id = :userId and e.isDeleted=false AND e.date >= :startDate GROUP BY e.date ORDER BY e.date")
    List<Object[]> findDailyExpensesByUser(@Param("userId") Long userId, @Param("startDate") LocalDate startDate);
    
}
