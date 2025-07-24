package com.misogi.budgetsplit.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.misogi.budgetsplit.config.CurrencyExchangeService;
import com.misogi.budgetsplit.dto.AddExpenseRequest;
import com.misogi.budgetsplit.dto.DailyExpenseDto;
import com.misogi.budgetsplit.dto.ExpenseResponse;
import com.misogi.budgetsplit.dto.ExpenseShareResponse;
import com.misogi.budgetsplit.dto.ExpenseSplitDTO;
import com.misogi.budgetsplit.dto.GroupBalanceDTO;
import com.misogi.budgetsplit.dto.SettelmentLogResponse;
import com.misogi.budgetsplit.dto.SettlementInstruction;
import com.misogi.budgetsplit.dto.UserBalanceDto;
import com.misogi.budgetsplit.dto.UserDto;
import com.misogi.budgetsplit.model.Expense;
import com.misogi.budgetsplit.model.ExpenseGroup;
import com.misogi.budgetsplit.model.ExpenseShare;
import com.misogi.budgetsplit.model.GroupMember;
import com.misogi.budgetsplit.model.SettlementLogs;
import com.misogi.budgetsplit.model.User;
import com.misogi.budgetsplit.repository.ExpenseGroupRepository;
import com.misogi.budgetsplit.repository.ExpenseRepository;
import com.misogi.budgetsplit.repository.ExpenseShareRepository;
import com.misogi.budgetsplit.repository.SettlementLogsRepository;
import com.misogi.budgetsplit.repository.UserRepository;

@Service
public class ExpenseService {
	@Autowired
	private ExpenseRepository expenseRepo;

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private ExpenseGroupRepository groupRepo;

	@Autowired
	private ExpenseShareRepository shareRepo;

	@Autowired
	private SettlementLogsRepository logsRepo;

	@Autowired
	private LogService logService;

	@Autowired
	private contextService contextService;

	@Autowired
	private EmailService emailService;

	@Autowired
	private CurrencyExchangeService currencyExchangeService;

	public Expense addExpense(AddExpenseRequest request) {
		Expense expense = new Expense();
		expense.setAmount(request.getAmount());
		expense.setDescription(request.getDescription());
		expense.setDate(request.getDate());
		expense.setCurrency(request.getCurrency());
		expense.setName(request.getName());
		User user = userRepo.findById(request.getPaidByUserId()).orElseThrow();
		expense.setPaidBy(user);
		ExpenseGroup group = groupRepo.findById(request.getGroupId()).orElseThrow();
		expense.setGroup(group);

		expense = expenseRepo.save(expense);
		String baseCurrency = group.getBaseCurrency();
		String expenseCurrency = expense.getCurrency();
		BigDecimal exchangeRate = currencyExchangeService.getExchangeRate(expenseCurrency, baseCurrency);
		for (ExpenseSplitDTO split : request.getSplits()) {
			ExpenseShare share = new ExpenseShare();
			share.setExpense(expense);
			share.setParticipant(userRepo.findById(split.getParticipantUserId()).orElseThrow());
			share.setPercentage(split.getPercentage());
			BigDecimal participantShare = request.getAmount()
					.multiply(split.getPercentage().divide(BigDecimal.valueOf(100)));
			BigDecimal convertedAmount = participantShare.multiply(exchangeRate);
			share.setConvertedAmount(convertedAmount);
			shareRepo.save(share);
		}
		List<String> emailList = group.getMembers().stream().map(i -> i.getUser().getEmail())
				.collect(Collectors.toList());

		logService.logActivity(LogService.ActivityType.EXPENSE_ADDED, group.getName(), user.getFirstName(),
				expense.getAmount());
		emailService.sendExpenseAddedEmail(emailList, group.getName(), user.getFirstName(), expense.getDescription(),
				expense.getAmount().toString(), expense.getDate().toString());
		return expense;
	}

	public List<ExpenseResponse> getExpensesForGroup(Long groupId) {
		List<Expense> list = expenseRepo.findByGroupIdAndIsDeletedFalse(groupId);
		List<ExpenseResponse> response = new ArrayList<>();
		for (Expense ex : list) {
			ExpenseResponse res = new ExpenseResponse();
			res.setCurrency(ex.getCurrency());
			res.setDate(ex.getDate());
			res.setDescription(ex.getDescription());
			res.setGroupId(ex.getGroup().getId());
			res.setId(ex.getId());
			res.setExpenseName(ex.getName());
			res.setAmount(ex.getAmount());
			res.setPaidBy(UserDto.fromUser(ex.getPaidBy()));
			List<ExpenseShareResponse> list2 = new ArrayList<>();
			for (ExpenseShare es : ex.getShares()) {
				ExpenseShareResponse obj = new ExpenseShareResponse();
				obj.setConvertedAmount(es.getConvertedAmount());
				obj.setId(es.getId());
				obj.setParticipent(UserDto.fromUser(es.getParticipant()));
				obj.setConvertedAmount(es.getPercentage());
				list2.add(obj);
			}
			res.setShareResponse(list2);
			response.add(res);
		}
		return response;
	}

	public List<GroupBalanceDTO> calculateBalances(Long groupId) {
		List<GroupMember> members = groupRepo.findById(groupId).orElseThrow().getMembers();
		Map<Long, BigDecimal> balanceMap = new HashMap<>();

		for (GroupMember m : members) {
			balanceMap.put(m.getUser().getId(), BigDecimal.ZERO);
		}

		List<Expense> expenses = expenseRepo.findByGroupIdAndIsDeletedFalse(groupId);
		for (Expense e : expenses) {
			Long payerId = e.getPaidBy().getId();
			balanceMap.put(payerId, balanceMap.get(payerId).add(e.getAmount()));
			for (ExpenseShare s : e.getShares()) {
				Long participantId = s.getParticipant().getId();
				balanceMap.put(participantId, balanceMap.get(participantId).subtract(s.getConvertedAmount()));
			}
		}

		return balanceMap.entrySet().stream().map(entry -> {
			GroupBalanceDTO dto = new GroupBalanceDTO();
			dto.setUserDto((UserDto.fromUser(userRepo.findById(entry.getKey()).get())));
			dto.setNetBalance(entry.getValue());
			return dto;
		}).collect(Collectors.toList());
	}

	public List<SettlementInstruction> generateSettlement(Long groupId) {
		List<GroupBalanceDTO> balances = calculateBalances(groupId);

		PriorityQueue<GroupBalanceDTO> payers = new PriorityQueue<>(
				Comparator.comparing(GroupBalanceDTO::getNetBalance));
		PriorityQueue<GroupBalanceDTO> receivers = new PriorityQueue<>(
				(a, b) -> b.getNetBalance().compareTo(a.getNetBalance()));

		for (GroupBalanceDTO b : balances) {
			if (b.getNetBalance().compareTo(BigDecimal.ZERO) < 0)
				payers.add(b);
			else if (b.getNetBalance().compareTo(BigDecimal.ZERO) > 0)
				receivers.add(b);
		}

		List<SettlementInstruction> instructions = new ArrayList<>();
		while (!payers.isEmpty() && !receivers.isEmpty()) {
			GroupBalanceDTO payer = payers.poll();
			GroupBalanceDTO receiver = receivers.poll();

			BigDecimal amount = payer.getNetBalance().abs().min(receiver.getNetBalance());

			SettlementInstruction si = new SettlementInstruction();
			si.setFromUser(payer.getUserDto());
			si.setToUser(receiver.getUserDto());
			si.setAmount(amount);
			instructions.add(si);

			payer.setNetBalance(payer.getNetBalance().add(amount));
			receiver.setNetBalance(receiver.getNetBalance().subtract(amount));

			if (payer.getNetBalance().compareTo(BigDecimal.ZERO) < 0)
				payers.add(payer);
			if (receiver.getNetBalance().compareTo(BigDecimal.ZERO) > 0)
				receivers.add(receiver);
		}

		return instructions;
	}

	@Transactional
	public List<SettlementInstruction> settleUpGroupExpense(Long groupId) {
		List<SettlementInstruction> instructions = generateSettlement(groupId);
		User user = contextService.getCurrentUser();
		ExpenseGroup group = groupRepo.findById(groupId).get();
		for (SettlementInstruction instruction : instructions) {
			// Save to settlement log
			SettlementLogs log = new SettlementLogs();
			log.setGroupId(groupId);
			log.setFromUser(instruction.getFromUser().getFirstName() + " " + instruction.getFromUser().getLastName());
			log.setToUser(instruction.getToUser().getFirstName() + " " + instruction.getToUser().getLastName());
			log.setAmount(instruction.getAmount());
			log.setSettledAt(LocalDateTime.now());
			log.setFromUserId(instruction.getFromUser().getId());
			log.setToUserId(instruction.getToUser().getId());
			log.setGroupName(group.getName());
			log.setDescription("Settelment Completed");
			logsRepo.save(log);
		}

		List<Expense> userExpenses = expenseRepo.findByGroupIdAndIsDeletedFalse(groupId);
		userExpenses.forEach(i -> i.setDeleted(true));
		expenseRepo.saveAll(userExpenses);
		logService.logActivity(LogService.ActivityType.SETTLEMENT_DONE, group.getName(), user.getFirstName(), null);
		return instructions;
	}

	public List<ExpenseResponse> getMyAllExpense() {
		User user = contextService.getCurrentUser();
		List<ExpenseShare> list1 = shareRepo.findAllByParticipant(user);
		List<Expense> list2 = list1.stream().map(ExpenseShare::getExpense).distinct().collect(Collectors.toList());
		List<Expense> list = list2.stream().filter(i -> !i.isDeleted()).collect(Collectors.toList());
		List<ExpenseResponse> response = new ArrayList<>();
		for (Expense ex : list) {
			ExpenseResponse res = new ExpenseResponse();
			res.setCurrency(ex.getCurrency());
			res.setDate(ex.getDate());
			res.setDescription(ex.getDescription());
			res.setGroupId(ex.getGroup().getId());
			res.setId(ex.getId());
			res.setExpenseName(ex.getName());
			res.setAmount(ex.getAmount());
			res.setPaidBy(UserDto.fromUser(ex.getPaidBy()));
			List<ExpenseShareResponse> list3 = new ArrayList<>();
			for (ExpenseShare es : ex.getShares()) {
				ExpenseShareResponse obj = new ExpenseShareResponse();
				obj.setConvertedAmount(es.getConvertedAmount());
				obj.setId(es.getId());
				obj.setParticipent(UserDto.fromUser(es.getParticipant()));
				obj.setPercentage(es.getPercentage());
				list3.add(obj);
			}
			res.setShareResponse(list3);
			response.add(res);
		}
		return response;
	}

	public void deleteExpense(Long id) {
		Expense expense = expenseRepo.findById(id).get();
		List<ExpenseShare> shares = expense.getShares();
		shareRepo.deleteAll(shares);
		expenseRepo.delete(expense);
	}

	public List<SettelmentLogResponse> getSettlementLogResponse(Long userId, Long groupId) {
		List<SettlementLogs> list = null;

		if (userId != null) {
			list = logsRepo.findDistinctByUserId(userId);
		} else {
			list = logsRepo.findByGroupId(groupId);
		}
		List<SettelmentLogResponse> response = list.stream().map(i -> new SettelmentLogResponse().toResponse(i))
				.collect(Collectors.toList());
		return response;
	}

	public UserBalanceDto getUserBalance(Long userId) {
		// Total paid by user
		BigDecimal paidByUser = expenseRepo.sumPaidAmountByUser(userId).orElse(BigDecimal.ZERO);

		// Total share user is responsible for
		BigDecimal owedByUser = shareRepo.sumOwedAmountByUser(userId).orElse(BigDecimal.ZERO);

		// amount owed = user owes to others
		// amount owed to user = user paid extra
		return new UserBalanceDto(owedByUser, paidByUser.subtract(owedByUser));
	}

	public List<DailyExpenseDto> getUserExpensesLast7Days(Long userId) {
		LocalDate sevenDaysAgo = LocalDate.now().minusDays(6); // includes today
		List<Object[]> data = expenseRepo.findDailyExpensesByUser(userId, sevenDaysAgo);
		return data.stream().map(obj -> new DailyExpenseDto((LocalDate) obj[0], (BigDecimal) obj[1]))
				.collect(Collectors.toList());
	}
}
