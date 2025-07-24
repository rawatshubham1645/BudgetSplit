package com.misogi.budgetsplit.config;

import java.util.concurrent.Executor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.web.client.RestTemplate;

@Configuration
@EnableAsync
public class CommonConfig {
	@Bean
	public RestTemplate restTemplate() {
	    return new RestTemplate();
	}
	
	@Bean(name = "customExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4); // Minimum threads
        executor.setMaxPoolSize(10); // Max threads allowed
        executor.setQueueCapacity(100); // Pending task queue
        executor.setThreadNamePrefix("ExcelWorker-");
        executor.initialize();
        return executor;
    }
}
