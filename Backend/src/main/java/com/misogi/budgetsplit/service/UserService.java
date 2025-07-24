package com.misogi.budgetsplit.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.misogi.budgetsplit.dto.UserDto;
import com.misogi.budgetsplit.enums.Role;
import com.misogi.budgetsplit.exception.BadRequestException;
import com.misogi.budgetsplit.model.User;
import com.misogi.budgetsplit.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private contextService contextService;

    public User register(UserDto userDTO) {
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setMobileNumber(userDTO.getMobileNumber());
        user.setRole(Role.BUDGET_USER);
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public User updateProfile(UserDto profileDto) {
        User user = contextService.getCurrentUser();

        if (profileDto.getFirstName() != null) user.setFirstName(profileDto.getFirstName());
        if (profileDto.getLastName() != null) user.setLastName(profileDto.getLastName());      
       
        if (profileDto.getMobileNumber() != null) user.setMobileNumber(profileDto.getMobileNumber());
        return userRepository.save(user);
    }
    
    public UserDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .email(user.getEmail())
                .build();
    }
}
