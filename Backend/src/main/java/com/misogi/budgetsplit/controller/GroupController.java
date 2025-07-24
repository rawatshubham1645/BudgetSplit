package com.misogi.budgetsplit.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.mail.MessagingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.misogi.budgetsplit.dto.CreateGroupRequest;
import com.misogi.budgetsplit.dto.GroupResponseDto;
import com.misogi.budgetsplit.dto.JoinGroupRequest;
import com.misogi.budgetsplit.dto.MessageResponse;
import com.misogi.budgetsplit.dto.UserDto;
import com.misogi.budgetsplit.model.Expense;
import com.misogi.budgetsplit.model.ExpenseGroup;
import com.misogi.budgetsplit.model.User;
import com.misogi.budgetsplit.repository.ExpenseRepository;
import com.misogi.budgetsplit.service.EmailService;
import com.misogi.budgetsplit.service.GroupService;
import com.misogi.budgetsplit.service.contextService;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

	@Autowired
	private GroupService groupService;

	@Autowired
	private EmailService emailService;

	@Autowired
	private contextService contextService;

	@Autowired
	private ExpenseRepository expenseRepo;

	@PostMapping("/create")
	public ResponseEntity<?> createGroup(@RequestBody CreateGroupRequest request) {
		ExpenseGroup group = groupService.createGroup(request);
		return ResponseEntity.ok(new MessageResponse("", group));
	}

	@PostMapping("/join")
	public ResponseEntity<?> joinGroup(@RequestBody JoinGroupRequest request) {
		ExpenseGroup joinGroup = groupService.joinGroup(request);
		return ResponseEntity.ok(new MessageResponse("", joinGroup));
	}

	@GetMapping("/my")
	public ResponseEntity<?> getGroups() {
		List<GroupResponseDto> myGroups = groupService.getMyGroups();
		return ResponseEntity.ok(new MessageResponse("", myGroups));
	}

	@GetMapping("/{groupId}/members")
	public ResponseEntity<?> getMembers(@PathVariable Long groupId) {
		List<UserDto> groupMembers = groupService.getGroupMembers(groupId);
		return ResponseEntity.ok(new MessageResponse("", groupMembers));
	}

	@PostMapping("/invite")
	public ResponseEntity<?> inviteGroupMembers(@RequestParam String email, @RequestParam String inviteCode) {
		User user = contextService.getCurrentUser();
		try {
			emailService.sendGroupInviteEmail(email, user.getFirstName(), inviteCode);
		} catch (MessagingException e) {
			System.err.println("email could not be sent");
		}
		return ResponseEntity.ok(new MessageResponse("", "Invite Sent Successfully"));
	}

	@GetMapping("/total-spend")
	public ResponseEntity<?> getTotalSpendByGroup(@RequestParam Long groupId) {

		List<Expense> expenses = expenseRepo.findByGroupId(groupId);
		BigDecimal total = expenses.stream().map(Expense::getAmount).filter(Objects::nonNull).reduce(BigDecimal.ZERO,
				BigDecimal::add);
		return ResponseEntity.ok(new MessageResponse("", Map.of("totalSpend", total)));
	}

}
