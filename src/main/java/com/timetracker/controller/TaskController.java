package com.timetracker.controller;

import com.timetracker.model.Task;
import com.timetracker.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<?> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        List<Map<String, Object>> result = tasks.stream()
            .map(t -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", t.getId());
                map.put("title", t.getTitle());
                map.put("description", t.getDescription() != null ? t.getDescription() : "");
                map.put("status", t.getStatus().toString());
                map.put("projectId", t.getProject() != null ? t.getProject().getId() : 0);
                map.put("assignedUserId", t.getAssignedUser() != null ? t.getAssignedUser().getId() : 0);
                return map;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Map<String, Object> body) {
        String title = (String) body.get("title");
        String description = (String) body.get("description");
        Integer projectId = body.get("projectId") != null ? (Integer) body.get("projectId") : null;
        Integer userId = body.get("userId") != null ? (Integer) body.get("userId") : null;
        
        Task task = taskService.createTask(title, description, projectId, userId);
        Map<String, Object> result = new HashMap<>();
        result.put("id", task.getId());
        result.put("title", task.getTitle());
        result.put("description", task.getDescription() != null ? task.getDescription() : "");
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/delete")
    public ResponseEntity<?> deleteTask(@PathVariable Integer id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Integer id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Integer id, 
                                          @RequestBody Map<String, String> request) {
        String title = request.get("title");
        String description = request.get("description");
        
        Task task = taskService.updateTask(id, title, description);
        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTaskRest(@PathVariable Integer id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok().build();
    }
}
