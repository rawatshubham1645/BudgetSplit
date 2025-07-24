package com.misogi.budgetsplit.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.misogi.budgetsplit.dto.CreateGroupRequest;
import com.misogi.budgetsplit.dto.GroupResponseDto;
import com.misogi.budgetsplit.dto.JoinGroupRequest;
import com.misogi.budgetsplit.dto.UserDto;
import com.misogi.budgetsplit.exception.BadRequestException;
import com.misogi.budgetsplit.model.ExpenseGroup;
import com.misogi.budgetsplit.model.GroupMember;
import com.misogi.budgetsplit.model.User;
import com.misogi.budgetsplit.repository.ExpenseGroupRepository;
import com.misogi.budgetsplit.repository.GroupMemberRepository;

@Service
public class GroupService {
	@Autowired
	private ExpenseGroupRepository groupRepo;

	@Autowired
	private GroupMemberRepository memberRepo;

	@Autowired
	private contextService contextService;
	
	@Autowired
	private LogService logService;

	public ExpenseGroup createGroup(CreateGroupRequest request) {
		ExpenseGroup group = new ExpenseGroup();
		group.setName(request.getName());
		group.setInviteCode(UUID.randomUUID().toString().substring(0, 8));
		group.setBaseCurrency(request.getBaseCurrency());
		group = groupRepo.save(group);

		GroupMember member = new GroupMember();
		member.setGroup(group);
		member.setUser(contextService.getCurrentUser());
		memberRepo.save(member);
		
		return group;
	}

	public ExpenseGroup joinGroup(JoinGroupRequest request) {
		ExpenseGroup group = groupRepo.findByInviteCode(request.getInviteCode())
				.orElseThrow(() -> new BadRequestException("Invalid invite code"));

		GroupMember member = new GroupMember();
		member.setGroup(group);
		User user = contextService.getCurrentUser();
		member.setUser(user);
		memberRepo.save(member);
		
		logService.logActivity(LogService.ActivityType.USER_JOINED_GROUP, group.getName(), user.getFirstName(), null);


		return group;
	}

	public List<UserDto> getGroupMembers(Long groupId) {
		List<User> list = memberRepo.findByGroupId(groupId).stream().map(GroupMember::getUser)
				.collect(Collectors.toList());
		List<UserDto> response = new ArrayList<>();
		for (User u : list) {
			UserDto res = UserDto.fromUser(u);
			response.add(res);
		}
		return response;
	}

	public List<GroupResponseDto> getMyGroups() {
		User user = contextService.getCurrentUser();
		List<GroupMember> list = memberRepo.findByUser(user);
		List<GroupResponseDto> response = new ArrayList<>();
		for (GroupMember gm : list) {
			GroupResponseDto obj = new GroupResponseDto();
			obj.setGroupName(gm.getGroup().getName());
			obj.setId(gm.getGroup().getId());
			obj.setInviteCode(gm.getGroup().getInviteCode());
			obj.setBaseCurrency(gm.getGroup().getBaseCurrency());
			List<UserDto> groupMembers = this.getGroupMembers(gm.getGroup().getId());
			obj.setTotalMembers(groupMembers.size());
			obj.setUsersList(groupMembers);
			response.add(obj);
		}
		return response;
	}

}