package com.misogi.budgetsplit.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.misogi.budgetsplit.model.SettlementLogs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SettelmentLogResponse {

	private Long id;

	private String groupName;

	private String fromUser;

	private String toUser;

	private BigDecimal amount;

	private LocalDate settledAt;

	private String description;
	
	
	public SettelmentLogResponse toResponse(SettlementLogs sl) {
		return new SettelmentLogResponse().builder()
				.id(sl.getId())
				.groupName(sl.getGroupName())
				.fromUser(sl.getFromUser())
				.toUser(sl.getToUser())
				.amount(sl.getAmount())
				.settledAt(sl.getSettledAt().toLocalDate())
				.description(sl.getDescription())
				.build();
	}
}
