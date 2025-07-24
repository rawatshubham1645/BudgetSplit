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
public class ExpenseResponse {

	private Long id;
	private String expenseName;
	private String description;
	private String currency;
	private LocalDate date;
	private Long groupId;
	private UserDto paidBy;
	private BigDecimal amount;
	private List<ExpenseShareResponse> shareResponse;
}
