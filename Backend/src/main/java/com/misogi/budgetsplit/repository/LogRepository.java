package com.misogi.budgetsplit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.misogi.budgetsplit.model.Log;

public interface LogRepository extends JpaRepository<Log, Long> {
    List<Log> findTop20ByOrderByTimestampDesc();
}
