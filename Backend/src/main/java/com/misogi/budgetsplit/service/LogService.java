package com.misogi.budgetsplit.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.misogi.budgetsplit.model.Log;
import com.misogi.budgetsplit.repository.LogRepository;

@Service
public class LogService {

    @Autowired
    private LogRepository logRepository;

    public void logActivity(ActivityType activityType, String groupName, String userName, BigDecimal amount) {
        String message = switch (activityType) {
            case EXPENSE_ADDED -> userName + " added an expense of ₹" + amount + " in group '" + groupName + "'";
            case SETTLEMENT_DONE -> userName + " settled balances in group '" + groupName + "'";
            case USER_JOINED_GROUP -> userName + " joined the group '" + groupName + "'";
            default -> "Unknown activity";
        };

        Log log = new Log();
        log.setLogDetail(message);
        log.setTimestamp(LocalDateTime.now());
        logRepository.save(log);
    }

    public List<Log> getRecentLogs() {
        return logRepository.findTop20ByOrderByTimestampDesc();
    }

    public enum ActivityType {
        EXPENSE_ADDED,
        SETTLEMENT_DONE,
        USER_JOINED_GROUP  // New activity type
    }
}
