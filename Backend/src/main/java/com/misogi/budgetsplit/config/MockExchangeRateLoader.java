package com.misogi.budgetsplit.config;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class MockExchangeRateLoader {

    @Autowired
    private StringRedisTemplate redisTemplate;

    @PostConstruct
    public void loadMockRates() {
    	 redisTemplate.opsForValue().set("USD_INR", "83.25");
         redisTemplate.opsForValue().set("INR_USD", "0.012");
         redisTemplate.opsForValue().set("EUR_INR", "90.00");
         redisTemplate.opsForValue().set("EUR_USD", "1.08");
         redisTemplate.opsForValue().set("GBP_INR", "102.50"); // Added GBP-INR
         redisTemplate.opsForValue().set("INR_GBP", "0.0098"); // Added INR-GBP
         redisTemplate.opsForValue().set("GBP_USD", "1.25"); // Added GBP-USD
         redisTemplate.opsForValue().set("USD_GBP", "0.80"); // Added USD-GBP
    }
}

