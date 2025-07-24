package com.misogi.budgetsplit.config;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class CurrencyExchangeService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    public BigDecimal getExchangeRate(String fromCurrency, String toCurrency) {
        if (fromCurrency.equalsIgnoreCase(toCurrency)) {
            return BigDecimal.ONE;
        }

        String key = fromCurrency.toUpperCase() + "_" + toCurrency.toUpperCase();
        String rateStr = redisTemplate.opsForValue().get(key);

        if (rateStr == null) {
            throw new RuntimeException("Exchange rate not found for " + key);
        }

        return new BigDecimal(rateStr);
    }
}
