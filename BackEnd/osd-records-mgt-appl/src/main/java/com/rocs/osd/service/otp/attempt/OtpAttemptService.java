package com.rocs.osd.service.otp.attempt;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

@Service
public class OtpAttemptService {

    public static final int MAX_NUMBER_OF_ATTEMPTS = 5;
    public static final int ATTEMPT_INCREMENTS = 1;
    private LoadingCache<String, Integer> otpAttemptCache;

    // Initialize the guava cache
    public OtpAttemptService() {
        super();
        otpAttemptCache = CacheBuilder.newBuilder()
                .expireAfterWrite(15, TimeUnit.MINUTES)
                .maximumSize(100)
                .build(new CacheLoader<String, Integer>() {
                    @Override
                    public Integer load(String key) throws Exception {
                        return 0;
                    }
                });
    }

    public void evictUserFromLoginAttemptCache(String username) {
        otpAttemptCache.invalidate(username);
    }

    public void addUserToLoginAttemptCache(String username) {
        int attempts = 0;
        try {
            attempts = ATTEMPT_INCREMENTS + otpAttemptCache.get(username);
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
        otpAttemptCache.put(username, attempts);
    }

    public boolean hasExceededMaxAttempts(String username) {
        try {
            return otpAttemptCache.get(username) >= MAX_NUMBER_OF_ATTEMPTS;
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
        return false;
    }
}
