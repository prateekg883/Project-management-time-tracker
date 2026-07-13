package com.timetracker.controller;

import com.timetracker.model.TimeLog;
import com.timetracker.service.TimeLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/timelogs")
public class TimeLogController {

    @Autowired
    private TimeLogService timeLogService;

    @GetMapping
    public ResponseEntity<?> getAllTimeLogs() {
        List<TimeLog> logs = timeLogService.getAllTimeLogs();
        List<Map<String, Object>> result = logs.stream()
            .map(log -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", log.getId());
                map.put("taskTitle", log.getTask() != null ? log.getTask().getTitle() : "No Task");
                map.put("userName", log.getUser() != null ? log.getUser().getFullName() : "Unknown");
                map.put("date", log.getDate() != null ? log.getDate().toString() : "");
                map.put("hours", log.getHoursSpent());
                map.put("description", log.getDescription() != null ? log.getDescription() : "");
                return map;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<?> createTimeLog(@RequestBody Map<String, Object> body) {
        Integer taskId = (Integer) body.get("taskId");
        Integer userId = (Integer) body.get("userId");
        String dateStr = (String) body.get("date");
        LocalDate date = dateStr != null ? LocalDate.parse(dateStr) : LocalDate.now();
        // Accept both "hoursSpent" (frontend) and "hours" (legacy) field names
        Number hoursRaw = body.get("hoursSpent") != null
            ? (Number) body.get("hoursSpent")
            : body.get("hours") != null ? (Number) body.get("hours") : 0;
        Double hours = hoursRaw.doubleValue();
        String description = (String) body.get("description");
        
        TimeLog log = timeLogService.createTimeLog(taskId, userId, date, hours, description);
        Map<String, Object> result = new HashMap<>();
        result.put("id", log.getId());
        result.put("taskTitle", log.getTask().getTitle());
        result.put("hours", log.getHoursSpent());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/delete")
    public ResponseEntity<?> deleteTimeLog(@PathVariable Integer id) {
        timeLogService.deleteTimeLog(id);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/total")
    public ResponseEntity<?> getTotalHours() {
        Double total = timeLogService.getTotalHours();
        return ResponseEntity.ok(Map.of("totalHours", total));
    }
}
