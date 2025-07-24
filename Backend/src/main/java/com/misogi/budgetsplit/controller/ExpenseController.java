package com.misogi.budgetsplit.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.misogi.budgetsplit.dto.AddExpenseRequest;
import com.misogi.budgetsplit.dto.ExpenseResponse;
import com.misogi.budgetsplit.dto.GroupBalanceDTO;
import com.misogi.budgetsplit.dto.MessageResponse;
import com.misogi.budgetsplit.dto.SettelmentLogResponse;
import com.misogi.budgetsplit.dto.SettlementInstruction;
import com.misogi.budgetsplit.model.Expense;
import com.misogi.budgetsplit.service.ExpenseService;
import com.misogi.budgetsplit.service.contextService;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;
    
    @Autowired
    private contextService contextService;
    

    @PostMapping("/add")
    public ResponseEntity<?> addExpense(@RequestBody AddExpenseRequest request) {
    	expenseService.addExpense(request);
        return ResponseEntity.ok(new MessageResponse("Expense added successfully", null));
    }
    
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteExpense(@RequestParam("expenseId")Long id){
    	expenseService.deleteExpense(id);
    	return ResponseEntity.ok(new MessageResponse("Expense deleted successfully"));
    }
    
    @GetMapping("/my")
    public ResponseEntity<?> myExpenses() {
       List<ExpenseResponse> res = expenseService.getMyAllExpense();
       return ResponseEntity.ok(new MessageResponse("", res));
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<?> getExpenses(@PathVariable Long groupId) {
    	List<ExpenseResponse> expensesForGroup = expenseService.getExpensesForGroup(groupId);
        return ResponseEntity.ok(new MessageResponse("", expensesForGroup));
    }
    
    @GetMapping("/balances/{groupId}")
    public ResponseEntity<?> getBalances(@PathVariable Long groupId) {
    	List<GroupBalanceDTO> calculateBalances = expenseService.calculateBalances(groupId);
        return ResponseEntity.ok(new MessageResponse("", calculateBalances));
    }

    @GetMapping("/settlement/{groupId}")
    public ResponseEntity<?> getSettlement(@PathVariable Long groupId) {
    	List<SettlementInstruction> settlement = expenseService.generateSettlement(groupId);
        return ResponseEntity.ok(new MessageResponse("", settlement));
    }
    
    @PostMapping("/group/settlement")
    public ResponseEntity<?> settleGroupExpense(@RequestParam("groupId")Long groupId) {
    	List<SettlementInstruction> settleUpGroupExpense = expenseService.settleUpGroupExpense(groupId);
        return ResponseEntity.ok(new MessageResponse("Group Expense Settle up successfully", settleUpGroupExpense));
    }
    
    @GetMapping("/group/settlement/history")
    public ResponseEntity<?> getGroupSettlementHistory(@RequestParam("groupId")Long groupId) {
    	List<SettelmentLogResponse> response = expenseService.getSettlementLogResponse(null, groupId);
    	return ResponseEntity.ok(new MessageResponse("", response));
    }
    
    @GetMapping("/my/settlement/history")
    public ResponseEntity<?> getMySettlementHistory() {
    	Long userId = contextService.getCurrentUser().getId();
    	List<SettelmentLogResponse> response = expenseService.getSettlementLogResponse(userId, null);
    	return ResponseEntity.ok(new MessageResponse("", response));
    }
    
    
    
}
