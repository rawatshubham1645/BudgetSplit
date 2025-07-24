package com.misogi.budgetsplit.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import com.misogi.budgetsplit.dto.SettelmentLogResponse;
import com.misogi.budgetsplit.model.Log;

@Service
public class ExcelExport {

	public ByteArrayInputStream exportSettlementLogsAsExcel(List<SettelmentLogResponse> logs) throws IOException {
		try (Workbook workbook = new XSSFWorkbook()) {
			Sheet sheet = workbook.createSheet("Settlement Logs");

			CellStyle headerStyle = workbook.createCellStyle();
			XSSFFont font = ((XSSFWorkbook) workbook).createFont();
			font.setBold(true);
			headerStyle.setFont(font);
			headerStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
			headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
			headerStyle.setAlignment(HorizontalAlignment.CENTER);

			Row headerRow = sheet.createRow(0);
			String[] headers = { "ID", "Group Name", "From User", "To User", "Amount", "Settled At", "Description" };
			for (int i = 0; i < headers.length; i++) {
				Cell cell = headerRow.createCell(i);
				cell.setCellValue(headers[i]);
				cell.setCellStyle(headerStyle);
				sheet.autoSizeColumn(i);
			}

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

			int rowIdx = 1;
			for (SettelmentLogResponse log : logs) {
				Row row = sheet.createRow(rowIdx++);
				row.createCell(0).setCellValue(log.getId());
				row.createCell(1).setCellValue(log.getGroupName());
				row.createCell(2).setCellValue(log.getFromUser());
				row.createCell(3).setCellValue(log.getToUser());
				row.createCell(4).setCellValue(log.getAmount().doubleValue());
				row.createCell(5).setCellValue(log.getSettledAt().format(formatter));
				row.createCell(6).setCellValue(log.getDescription());
			}

			ByteArrayOutputStream out = new ByteArrayOutputStream();
			workbook.write(out);
			return new ByteArrayInputStream(out.toByteArray());
		}
	}
	
	public ByteArrayInputStream exportLogsAsExcel(List<Log> logs) throws IOException {
	    try (Workbook workbook = new XSSFWorkbook()) {
	        Sheet sheet = workbook.createSheet("Logs");

	        CellStyle headerStyle = workbook.createCellStyle();
	        XSSFFont font = ((XSSFWorkbook) workbook).createFont();
	        font.setBold(true);
	        headerStyle.setFont(font);
	        headerStyle.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
	        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
	        headerStyle.setAlignment(HorizontalAlignment.CENTER);

	        Row headerRow = sheet.createRow(0);
	        String[] headers = { "ID", "Log Detail", "Timestamp" };
	        for (int i = 0; i < headers.length; i++) {
	            Cell cell = headerRow.createCell(i);
	            cell.setCellValue(headers[i]);
	            cell.setCellStyle(headerStyle);
	            sheet.autoSizeColumn(i);
	        }

	        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

	        int rowIdx = 1;
	        for (Log log : logs) {
	            Row row = sheet.createRow(rowIdx++);
	            row.createCell(0).setCellValue(log.getId());
	            row.createCell(1).setCellValue(log.getLogDetail());
	            row.createCell(2).setCellValue(log.getTimestamp().format(formatter));
	        }

	        ByteArrayOutputStream out = new ByteArrayOutputStream();
	        workbook.write(out);
	        return new ByteArrayInputStream(out.toByteArray());
	    }
	}
}
