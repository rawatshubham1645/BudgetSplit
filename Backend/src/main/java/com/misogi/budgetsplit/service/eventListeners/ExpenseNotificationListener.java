package com.misogi.budgetsplit.service.eventListeners;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import com.misogi.budgetsplit.model.Expense;
import com.misogi.budgetsplit.model.User;
import com.misogi.budgetsplit.service.event.ExpenseAddedEvent;

@Component
public class ExpenseNotificationListener {

    @Autowired 
    private JavaMailSender mailSender;

    @EventListener
    public void onExpenseAdded(ExpenseAddedEvent event) {
//        Expense expense = event.getExpense();
//        // Fetch participant emails from expense.getParticipants()
//        for (User participant : expense.getParticipants()) {
//            String email = participant.getEmail();
//            SimpleMailMessage message = new SimpleMailMessage();
//            message.setTo(email);
//            message.setSubject("New Expense Added in Group: " + expense.getGroup().getName());
//            message.setText("An expense has been added by " + expense.getPayer().getFirstName()
//                    + " for ₹" + expense.getAmount() + "\nDescription: " + expense.getDescription());
//            mailSender.send(message);
//        }
    }
}

