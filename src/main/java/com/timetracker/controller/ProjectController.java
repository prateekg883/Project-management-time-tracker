package com.timetracker.controller;

import com.timetracker.model.Project;
import com.timetracker.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public ResponseEntity<?> getAllProjects() {
        List<Project> projects = projectService.getAllProjects();
        List<Map<String, Object>> result = projects.stream()
            .map(p -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", p.getId());
                map.put("title", p.getTitle());
                map.put("description", p.getDescription() != null ? p.getDescription() : "");
                map.put("status", p.getStatus().toString());
                map.put("startDate", p.getStartDate() != null ? p.getStartDate().toString() : "");
                map.put("endDate", p.getEndDate() != null ? p.getEndDate().toString() : "");
                return map;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProject(@PathVariable Integer id) {
        Project p = projectService.getProjectById(id);
        Map<String, Object> result = new HashMap<>();
        result.put("id", p.getId());
        result.put("title", p.getTitle());
        result.put("description", p.getDescription() != null ? p.getDescription() : "");
        result.put("status", p.getStatus().toString());
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody Map<String, String> body) {
        String title = body.get("title");
        String description = body.get("description");
        Project project = projectService.createProject(title, description);
        Map<String, Object> result = new HashMap<>();
        result.put("id", project.getId());
        result.put("title", project.getTitle());
        result.put("description", project.getDescription() != null ? project.getDescription() : "");
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        String title = body.get("title");
        String description = body.get("description");
        Project project = projectService.updateProject(id, title, description);
        Map<String, Object> result = new HashMap<>();
        result.put("id", project.getId());
        result.put("title", project.getTitle());
        result.put("description", project.getDescription() != null ? project.getDescription() : "");
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/delete")
    public ResponseEntity<?> deleteProject(@PathVariable Integer id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProjectRest(@PathVariable Integer id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<Project>> getProjectsByManager(@PathVariable Integer managerId) {
        return ResponseEntity.ok(projectService.getProjectsByManager(managerId));
    }
}
