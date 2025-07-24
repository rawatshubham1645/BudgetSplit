package com.misogi.budgetsplit.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DailyExpenseDto {
    private LocalDate date;
    private BigDecimal totalSpent;
}