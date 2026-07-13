package com.timetracker.controller;

import com.timetracker.model.Task;
import com.timetracker.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST Controller for Task Status Updates
 * Demonstrates atomic transaction: Update task status + Recalculate project progress
 */
@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskStatusController {

    @Autowired
    private TaskService taskService;

    /**
     * Update task status with atomic project progress recalculation
     * This endpoint ensures data consistency between task and project
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateTaskStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request) {
        
        String statusStr = request.get("status");
        Task.TaskStatus newStatus = Task.TaskStatus.valueOf(statusStr);
        
        // Atomic transaction: Updates task AND recalculates project progress
        Task updatedTask = taskService.updateTaskStatus(id, newStatus);
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "taskId", updatedTask.getId(),
            "newStatus", updatedTask.getStatus().toString(),
            "projectProgress", updatedTask.getProject() != null ? 
                updatedTask.getProject().getProgressPercentage() : 0
        ));
    }
}
