package com.misogi.budgetsplit.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddExpenseRequest {
	private String name;
    private BigDecimal amount;
    private String description;
    private String currency;
    private LocalDate date;
    private Long paidByUserId;
    private Long groupId;
    private List<ExpenseSplitDTO> splits;
}
