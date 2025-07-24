package com.misogi.budgetsplit.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "expenses")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    private BigDecimal amount;
    private String currency;
    private LocalDate date;

    @ManyToOne
    private ExpenseGroup group;
    
    private boolean isDeleted = false;

    @ManyToOne
    private User paidBy;
    
    @OneToMany(mappedBy = "expense", cascade = CascadeType.ALL)
    private List<ExpenseShare> shares;
}