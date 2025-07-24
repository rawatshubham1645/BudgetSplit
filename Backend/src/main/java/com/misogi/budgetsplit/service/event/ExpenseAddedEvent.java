package com.misogi.budgetsplit.service.event;

import org.springframework.context.ApplicationEvent;

import com.misogi.budgetsplit.model.Expense;

public class ExpenseAddedEvent extends ApplicationEvent {
    private final Expense expense;
    public ExpenseAddedEvent(Object source, Expense expense) {
        super(source);
        this.expense = expense;
    }
    public Expense getExpense() { return expense; }
}