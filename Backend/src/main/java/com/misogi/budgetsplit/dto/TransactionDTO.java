package com.misogi.budgetsplit.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Builder
public class TransactionDTO {
    private String date;
    private double amount;

    public TransactionDTO(String date, double amount) {
        this.date = date;
        this.amount = amount;
    }
}
