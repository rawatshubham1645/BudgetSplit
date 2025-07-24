package com.misogi.budgetsplit.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExpenseSplitDTO {
	private Long participantUserId;
    private BigDecimal percentage;
}
