package com.misogi.budgetsplit.dto;

import java.util.List;

import lombok.Data;

@Data
public class GroupResponseDto {

	private Long id;
	private String groupName;
	private String inviteCode;
	private Integer totalMembers;
	private String baseCurrency;
	private List<UserDto> usersList;
	
}
