package com.misogi.budgetsplit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.misogi.budgetsplit.model.GroupMember;
import com.misogi.budgetsplit.model.User;

public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
	List<GroupMember> findByGroupId(Long groupId);

	List<GroupMember> findByUser(User user);
	
	int countByUser(User user);
}