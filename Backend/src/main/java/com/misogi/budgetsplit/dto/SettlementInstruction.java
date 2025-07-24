package com.misogi.budgetsplit.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SettlementInstruction {
	private UserDto fromUser;
    private UserDto toUser;
    private BigDecimal amount;
}
