package com.misogi.budgetsplit.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.misogi.budgetsplit.model.ExpenseShare;
import com.misogi.budgetsplit.model.User;

public interface ExpenseShareRepository extends JpaRepository<ExpenseShare, Long> {
	
	List<ExpenseShare> findAllByParticipant(User user);
	
	@Query("SELECT SUM(es.convertedAmount) FROM ExpenseShare es WHERE es.participant.id = :userId")
    Optional<BigDecimal> sumOwedAmountByUser(@Param("userId") Long userId);
}
