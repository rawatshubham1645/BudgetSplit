package com.misogi.budgetsplit.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.misogi.budgetsplit.model.SettlementLogs;
import com.misogi.budgetsplit.model.User;

public interface SettlementLogsRepository extends JpaRepository<SettlementLogs, Long> {
    List<SettlementLogs> findByGroupId(Long groupId);
    
    @Query("SELECT DISTINCT s FROM SettlementLogs s WHERE s.fromUserId = :userId OR s.toUserId = :userId")
    List<SettlementLogs> findDistinctByUserId(@Param("userId") Long userId);
    
    List<SettlementLogs> findByFromUserAndSettledAtAfter(User fromUser, LocalDateTime createdAt);
    
}