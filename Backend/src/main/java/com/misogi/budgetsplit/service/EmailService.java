package com.misogi.budgetsplit.service;

import java.util.List;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

	@Autowired
	private JavaMailSender mailSender;

	@Value("${spring.mail.username}")
	private String email;

	public void sendSignupOtpEmail(String to, String subject, String userName, String otp) throws MessagingException {
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);

		String htmlContent = """
				<!DOCTYPE html>
				<html>
				<head>
				    <meta charset="UTF-8">
				    <title>BudgetSplit Email Verification</title>
				</head>
				<body style="margin:0; padding:0; background-color:#f9fafc; font-family:'Segoe UI', sans-serif;">
				    <table width="100%%" cellpadding="0" cellspacing="0" style="padding:50px 0;">
				        <tr>
				            <td align="center">
				                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; box-shadow:0 6px 16px rgba(0,0,0,0.08); padding:45px;">
				                    <tr>
				                        <td align="center">
				                            <h2 style="color:#1a237e; font-size:28px;">Welcome to <span style="color:#3949ab;">BudgetSplit</span></h2>
				                            <p style="font-size:16px; color:#333; margin-top:24px;">Hi <strong>%s</strong>,</p>
				                            <p style="font-size:15px; color:#555;">Thank you for signing up to manage and track shared expenses with ease.</p>
				                            <p style="font-size:15px; color:#555;">Use the OTP below to verify your email and activate your BudgetSplit account:</p>
				                            <div style="margin: 35px 0;">
				                                <span style="background-color:#1a237e; color:#ffffff; padding:14px 32px; font-size:24px; border-radius:10px; letter-spacing:5px; display:inline-block;">
				                                    %s
				                                </span>
				                            </div>
				                            <p style="color:#888; font-size:13px;">This OTP is valid for 5 minutes.</p>
				                            <hr style="margin:30px 0; border:none; border-top:1px solid #e0e0e0;" />
				                            <p style="font-size:13px; color:#999;">Didn’t request this? Just ignore this message.</p>
				                            <p style="font-size:13px; color:#999;">Need help? Contact <a href="mailto:support@budgetsplit.in" style="color:#3949ab;">support@budgetsplit.in</a></p>
				                        </td>
				                    </tr>
				                </table>
				            </td>
				        </tr>
				    </table>
				</body>
				</html>
				"""
				.formatted(userName, otp);

		helper.setTo(to);
		helper.setSubject(subject);
		helper.setText(htmlContent, true); // true = isHtml
		helper.setFrom(email);

		mailSender.send(message);
	}

	public void sendForgotPasswordOtpEmail(String to, String subject, String userName, String otp)
			throws MessagingException {
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);

		String content = """
				<!DOCTYPE html>
				<html>
				<head>
				    <meta charset="UTF-8">
				    <title>BudgetSplit Password Reset</title>
				</head>
				<body style="font-family: Arial, sans-serif; background-color: #f9fafc; padding: 20px;">
				    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 32px; border-radius: 10px; box-shadow: 0px 6px 16px rgba(0,0,0,0.08);">
				        <h2 style="color: #1a237e;">Hello %s,</h2>
				        <p style="font-size: 16px; color: #444;">
				            We received a request to reset your <strong>BudgetSplit</strong> account password. Please use the OTP below to proceed:
				        </p>
				        <div style="text-align: center; margin: 35px 0;">
				            <span style="display: inline-block; background-color: #1a237e; color: #ffffff; padding: 16px 36px; font-size: 24px; border-radius: 8px; letter-spacing: 4px;">
				                %s
				            </span>
				        </div>
				        <p style="font-size: 14px; color: #888;">This OTP is valid for 5 minutes.</p>
				        <p style="font-size: 14px; color: #888;">If you did not request this, you can safely ignore this email.</p>
				        <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;">
				        <p style="font-size: 13px; color: #aaa;">Thank you,<br>The BudgetSplit Team</p>
				    </div>
				</body>
				</html>
				"""
				.formatted(userName, otp);

		helper.setTo(to);
		helper.setSubject(subject);
		helper.setText(content, true); // true = isHtml
		helper.setFrom(email);

		mailSender.send(message);
	}

	public void sendGroupInviteEmail(String to, String userName, String inviteCode) throws MessagingException {
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);

		String content = """
				<!DOCTYPE html>
				<html>
				<head>
				    <meta charset="UTF-8">
				    <title>BudgetSplit Group Invitation</title>
				</head>
				<body style="font-family: 'Segoe UI', sans-serif; background-color: #e6f2ff; padding: 20px;">
				    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 32px; border-radius: 12px; box-shadow: 0px 6px 16px rgba(0,0,0,0.1);">
				        <h2 style="color: #4a148c;">Hello,</h2>
				        <p style="font-size: 16px; color: #333;">
				            You've been invited to join a group on <strong>BudgetSplit</strong> to manage expenses and stay in sync!
				        </p>
				        <p style="font-size: 15px; color: #444;">
				            Use the following group invite code to join:
				        </p>
				        <div style="text-align: center; margin: 35px 0;">
				            <span style="display: inline-block; background-color: #00897b; color: #ffffff; padding: 16px 36px; font-size: 24px; border-radius: 8px; letter-spacing: 4px;">
				                %s
				            </span>
				        </div>
				        <p style="font-size: 14px; color: #666;">Open the BudgetSplit app or website, go to "Join Group", and enter this code to get started.</p>
				        <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;">
				        <p style="font-size: 13px; color: #999;">Need help? Contact us at <a href="mailto:support@budgetsplit.in" style="color: #4a148c;">support@budgetsplit.in</a><br>
				        Cheers,<br>The BudgetSplit Team</p>
				    </div>
				</body>
				</html>
				"""
				.formatted(inviteCode);

		helper.setTo(to);
		helper.setSubject("Your BudgetSplit Group Invitation Awaits 🎉");
		helper.setText(content, true); // true = isHtml
		helper.setFrom(email);
		mailSender.send(message);
	}

	public void sendExpenseAddedEmail(List<String> recipientEmails, String groupName, String addedBy,
			String description, String amount, String date) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setSubject("New Expense Added in " + groupName);
			helper.setFrom(email);

			// Add recipients as BCC (or use To for internal group visibility)
			for (String e : recipientEmails) {
				helper.addBcc(e);
			}

			// Compose HTML content
			String content = """
					<!DOCTYPE html>
					<html>
					<head><meta charset="UTF-8"><title>BudgetSplit Expense Added</title></head>
					<body style="margin:0; padding:0; background-color:#f9fafc; font-family:'Segoe UI', sans-serif;">
					    <table width="100%%" cellpadding="0" cellspacing="0" style="padding:50px 0;">
					        <tr><td align="center">
					            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; box-shadow:0 6px 16px rgba(0,0,0,0.08); padding:45px;">
					                <tr><td align="center">
					                    <h2 style="color:#1a237e; font-size:26px;">New Expense Added in <span style="color:#3949ab;">%s</span></h2>
					                    <p style="font-size:16px; color:#333; margin-top:24px;">Hi, </p>
					                    <p style="font-size:15px; color:#555;">A new expense has been added to your group <strong>%s</strong>.</p>
					                    <p style="font-size:15px; color:#555;"><strong>%s</strong> added an expense:</p>
					                    <div style="margin: 30px 0; text-align:left; background-color:#f1f8e9; padding:18px 24px; border-radius:10px;">
					                        <p style="font-size:15px; color:#333;"><strong>Description:</strong> %s</p>
					                        <p style="font-size:15px; color:#333;"><strong>Amount:</strong> ₹%s</p>
					                        <p style="font-size:15px; color:#333;"><strong>Date:</strong> %s</p>
					                    </div>
					                    <p style="font-size:14px; color:#666;">Open the BudgetSplit app or website to view and settle this expense.</p>
					                    <hr style="margin:30px 0; border:none; border-top:1px solid #e0e0e0;" />
					                    <p style="font-size:13px; color:#999;">Need help? Contact <a href="mailto:support@budgetsplit.in" style="color:#3949ab;">support@budgetsplit.in</a></p>
					                    <p style="font-size:13px; color:#999;">Thanks,<br>The BudgetSplit Team</p>
					                </td></tr></table>
					        </td></tr></table>
					</body>
					</html>
					"""
					.formatted(groupName, groupName, addedBy, description, amount, date);

			helper.setText(content, true); // Enable HTML

			mailSender.send(message);
		} catch (Exception e) {
			e.printStackTrace();
			// Optional: Log or notify failure
		}
	}

}