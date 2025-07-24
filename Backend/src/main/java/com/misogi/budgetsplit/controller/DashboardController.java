package com.misogi.budgetsplit.controller;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.misogi.budgetsplit.dto.DailyExpenseDto;
import com.misogi.budgetsplit.dto.MessageResponse;
import com.misogi.budgetsplit.dto.SettelmentLogResponse;
import com.misogi.budgetsplit.dto.TransactionDTO;
import com.misogi.budgetsplit.dto.UserBalanceDto;
import com.misogi.budgetsplit.model.Log;
import com.misogi.budgetsplit.model.SettlementLogs;
import com.misogi.budgetsplit.model.User;
import com.misogi.budgetsplit.repository.GroupMemberRepository;
import com.misogi.budgetsplit.repository.SettlementLogsRepository;
import com.misogi.budgetsplit.service.ExcelExport;
import com.misogi.budgetsplit.service.ExpenseService;
import com.misogi.budgetsplit.service.LogService;
import com.misogi.budgetsplit.service.contextService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

	@Autowired
	private contextService contextService;

	@Autowired
	private GroupMemberRepository groupMemberRepo;

	@Autowired
	private SettlementLogsRepository settlementRepository;
	
	@Autowired
	private ExpenseService expenseService;

	@Autowired
	private LogService logService;

	@Autowired
	private ExcelExport excelExport;

	@GetMapping("/group-count")
	public ResponseEntity<?> getTotalGroups() {
		User user = contextService.getCurrentUser();
		int count = groupMemberRepo.countByUser(user);
		return ResponseEntity.ok(new MessageResponse("", Map.of("groupCount", count)));
	}

//	@GetMapping("/transaction-history")
//	public ResponseEntity<?> getTransactionHistory() {
//		User authUser = contextService.getCurrentUser();
//		LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
//
//		List<SettlementLogs> settlements = settlementRepository.findByFromUserAndSettledAtAfter(authUser, sevenDaysAgo);
//
//		List<TransactionDTO> result = settlements.stream()
//				.map(settlement -> new TransactionDTO(settlement.getSettledAt().toString(),
//						settlement.getAmount().doubleValue()))
//				.collect(Collectors.toList());
//
//		return ResponseEntity.ok(new MessageResponse("", result));
//	}

	@GetMapping("/logs/recent")
	public ResponseEntity<?> getRecentLogs() {
		List<Log> recentLogs = logService.getRecentLogs();
		return ResponseEntity.ok(new MessageResponse("", recentLogs));
	}
	
	@GetMapping("/balance")
    public ResponseEntity<UserBalanceDto> getUserBalance() {
		User user = contextService.getCurrentUser();
        return ResponseEntity.ok(expenseService.getUserBalance(user.getId()));
    }

    @GetMapping("/daily-summary")
    public ResponseEntity<List<DailyExpenseDto>> getUserDailyExpenses() {
    	Long userId = contextService.getCurrentUser().getId();
        return ResponseEntity.ok(expenseService.getUserExpensesLast7Days(userId));
    }

	@GetMapping("/my/export-settlements")
	public ResponseEntity<InputStreamResource> exportMySettlements() throws IOException {
		Long userId = contextService.getCurrentUser().getId();
		List<SettlementLogs> logs = settlementRepository.findDistinctByUserId(userId);
		if (!logs.isEmpty()) {
			List<SettelmentLogResponse> collect = logs.stream().map(i -> new SettelmentLogResponse().toResponse(i))
					.collect(Collectors.toList());
			ByteArrayInputStream in = excelExport.exportSettlementLogsAsExcel(collect);

			HttpHeaders headers = new HttpHeaders();
			headers.add("Content-Disposition", "attachment; filename=settlement_logs.xlsx");

			return ResponseEntity.ok().headers(headers)
					.contentType(MediaType
							.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
					.body(new InputStreamResource(in));
		}

		return ResponseEntity.ok(null);

	}

	@GetMapping("/group/export-settlements")
	public ResponseEntity<InputStreamResource> exportGroupSettlements(@RequestParam("groupId") Long groupId)
			throws IOException {

		List<SettlementLogs> logs = settlementRepository.findByGroupId(groupId);
		if (!logs.isEmpty()) {
			List<SettelmentLogResponse> collect = logs.stream().map(i -> new SettelmentLogResponse().toResponse(i))
					.collect(Collectors.toList());
			ByteArrayInputStream in = excelExport.exportSettlementLogsAsExcel(collect);

			HttpHeaders headers = new HttpHeaders();
			headers.add("Content-Disposition", "attachment; filename=settlement_group_logs.xlsx");

			return ResponseEntity.ok().headers(headers)
					.contentType(MediaType
							.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
					.body(new InputStreamResource(in));
		}

		return ResponseEntity.ok(null);
	}

	@GetMapping("/export-recent-logs")
	public ResponseEntity<InputStreamResource> exportRecentLogs()
			throws IOException {

		List<Log> logs = logService.getRecentLogs();
		if (!logs.isEmpty()) {
			ByteArrayInputStream in = excelExport.exportLogsAsExcel(logs);

			HttpHeaders headers = new HttpHeaders();
			headers.add("Content-Disposition", "attachment; filename=settlement_group_logs.xlsx");

			return ResponseEntity.ok().headers(headers)
					.contentType(MediaType
							.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
					.body(new InputStreamResource(in));
		}

		return ResponseEntity.ok(null);
	}
}
