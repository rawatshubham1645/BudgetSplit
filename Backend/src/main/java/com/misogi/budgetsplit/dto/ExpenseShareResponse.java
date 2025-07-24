package com.misogi.budgetsplit.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExpenseShareResponse {

	private Long id;
	private UserDto participent;
	private BigDecimal percentage;
	private BigDecimal convertedAmount;
}
