package com.timetracker.controller;

import com.timetracker.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST Controller for Reports and Analytics
 * Provides endpoints for generating various reports with statistical data
 */
@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    /**
     * Get dashboard overview report
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardReport() {
        return ResponseEntity.ok(reportService.generateDashboardReport());
    }

    /**
     * Get project progress report
     */
    @GetMapping("/project-progress")
    public ResponseEntity<Map<String, Object>> getProjectProgressReport() {
        return ResponseEntity.ok(reportService.generateProjectProgressReport());
    }

    /**
     * Get time tracking report
     */
    @GetMapping("/time-tracking")
    public ResponseEntity<Map<String, Object>> getTimeTrackingReport() {
        return ResponseEntity.ok(reportService.generateTimeTrackingReport());
    }

    /**
     * Get task completion report
     */
    @GetMapping("/task-completion")
    public ResponseEntity<Map<String, Object>> getTaskCompletionReport() {
        return ResponseEntity.ok(reportService.generateTaskCompletionReport());
    }

    /**
     * Get team productivity report
     */
    @GetMapping("/team-productivity")
    public ResponseEntity<Map<String, Object>> getTeamProductivityReport() {
        return ResponseEntity.ok(reportService.generateTeamProductivityReport());
    }
}
