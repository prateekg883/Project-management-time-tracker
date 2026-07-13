package com.timetracker.controller;

import com.timetracker.model.TimeEntry;
import com.timetracker.service.TimeEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/time-entries")
@CrossOrigin(origins = "*")
public class TimeEntryController {

    @Autowired
    private TimeEntryService timeEntryService;

    @GetMapping
    public ResponseEntity<List<TimeEntry>> getAllTimeEntries() {
        return ResponseEntity.ok(timeEntryService.getAllTimeEntries());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimeEntry> getTimeEntryById(@PathVariable Integer id) {
        return ResponseEntity.ok(timeEntryService.getTimeEntryById(id));
    }

    @PostMapping("/start")
    public ResponseEntity<TimeEntry> startTimeEntry(@RequestBody Map<String, Object> request) {
        Integer taskId = (Integer) request.get("taskId");
        Integer userId = (Integer) request.get("userId");
        String description = (String) request.get("description");
        
        TimeEntry timeEntry = timeEntryService.startTimeEntry(taskId, userId, description);
        return ResponseEntity.ok(timeEntry);
    }

    @PutMapping("/{id}/stop")
    public ResponseEntity<TimeEntry> stopTimeEntry(@PathVariable Integer id) {
        TimeEntry timeEntry = timeEntryService.stopTimeEntry(id);
        return ResponseEntity.ok(timeEntry);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimeEntry> updateTimeEntry(@PathVariable Integer id,
                                                     @RequestBody Map<String, String> request) {
        String description = request.get("description");
        TimeEntry timeEntry = timeEntryService.updateTimeEntry(id, description);
        return ResponseEntity.ok(timeEntry);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTimeEntry(@PathVariable Integer id) {
        timeEntryService.deleteTimeEntry(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TimeEntry>> getTimeEntriesByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(timeEntryService.getTimeEntriesByUser(userId));
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<TimeEntry>> getTimeEntriesByTask(@PathVariable Integer taskId) {
        return ResponseEntity.ok(timeEntryService.getTimeEntriesByTask(taskId));
    }

    @GetMapping("/task/{taskId}/total")
    public ResponseEntity<Map<String, Long>> getTotalTimeByTask(@PathVariable Integer taskId) {
        Long totalMinutes = timeEntryService.getTotalTimeByTask(taskId);
        return ResponseEntity.ok(Map.of("totalMinutes", totalMinutes));
    }
}
