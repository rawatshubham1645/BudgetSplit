package com.misogi.budgetsplit.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "settlements")
public class SettlementLogs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String groupName;
    
    private Long groupId;
    
    private Long fromUserId;
    
    private Long toUserId;

    private String fromUser;

    private String toUser;

    private BigDecimal amount;

    private LocalDateTime settledAt;

    private String description; 
    
}