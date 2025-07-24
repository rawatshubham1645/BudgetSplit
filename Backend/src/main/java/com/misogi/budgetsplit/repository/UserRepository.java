package com.misogi.budgetsplit.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.misogi.budgetsplit.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByUniqueNameIgnoreCase(String uniqueName);
    
    Optional<User> findByUniqueNameIgnoreCase(String uniqueName);

}
