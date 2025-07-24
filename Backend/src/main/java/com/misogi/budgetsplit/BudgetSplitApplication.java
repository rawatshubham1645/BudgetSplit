package com.misogi.budgetsplit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@EnableCaching
@SpringBootApplication
public class BudgetSplitApplication {

	public static void main(String[] args) {
		SpringApplication.run(BudgetSplitApplication.class, args);
	}
	
}
