package com.misogi.budgetsplit.model;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.misogi.budgetsplit.dto.CreateGroupRequest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "expense_groups")
public class ExpenseGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String inviteCode;

    @OneToMany(mappedBy = "group")
    private List<GroupMember> members;

    @OneToMany(mappedBy = "group")
    private List<Expense> expenses;
    
    private String baseCurrency;	 
}