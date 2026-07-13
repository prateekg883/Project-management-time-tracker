package com.timetracker.controller;

import com.timetracker.service.ProjectService;
import com.timetracker.service.TaskService;
import com.timetracker.service.TimeLogService;
import com.timetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private TaskService taskService;

    @Autowired
    private TimeLogService timeLogService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        int projectCount = projectService.getAllProjects().size();
        int taskCount = (int) taskService.getAllTasks().stream()
            .filter(t -> t.getStatus() == com.timetracker.model.Task.TaskStatus.IN_PROGRESS)
            .count();
        int totalTasks = taskService.getAllTasks().size();
        long userCount = userRepository.count();
        Double totalHours = timeLogService.getTotalHours();
        
        Map<String, Object> result = new java.util.LinkedHashMap<>();
        result.put("projects",   projectCount);
        result.put("tasks",      taskCount);
        result.put("totalTasks", totalTasks);
        result.put("users",      userCount);
        result.put("hours",      totalHours.intValue());
        return ResponseEntity.ok(result);
    }
}
