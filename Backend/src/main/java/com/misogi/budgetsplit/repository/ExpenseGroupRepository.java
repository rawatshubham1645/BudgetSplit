package com.misogi.budgetsplit.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.misogi.budgetsplit.model.ExpenseGroup;

public interface ExpenseGroupRepository extends JpaRepository<ExpenseGroup, Long> {
    Optional<ExpenseGroup> findByInviteCode(String inviteCode);
}
