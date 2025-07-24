package com.misogi.budgetsplit.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GroupBalanceDTO {
	private UserDto userDto;
    private BigDecimal netBalance; // +ve means to receive, -ve means to pay
}
