package com.timetracker.service;

import com.timetracker.model.Project;
import com.timetracker.model.Task;
import com.timetracker.model.TimeLog;
import com.timetracker.model.User;
import com.timetracker.repository.ProjectRepository;
import com.timetracker.repository.TaskRepository;
import com.timetracker.repository.TimeLogRepository;
import com.timetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Report Generation Service
 * Generates analytics and reports for projects, tasks, and time tracking
 */
@Service
public class ReportService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TimeLogRepository timeLogRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Generate comprehensive dashboard statistics
     */
    public Map<String, Object> generateDashboardReport() {
        Map<String, Object> report = new HashMap<>();

        List<Project> allProjects = projectRepository.findAll();
        List<Task> allTasks = taskRepository.findAll();
        List<TimeLog> allTimeLogs = timeLogRepository.findAll();
        List<User> allUsers = userRepository.findAll();

        // Overall statistics
        report.put("totalProjects", allProjects.size());
        report.put("totalTasks", allTasks.size());
        report.put("totalUsers", allUsers.size());
        
        double totalHours = allTimeLogs.stream()
            .mapToDouble(TimeLog::getHoursSpent)
            .sum();
        report.put("totalHoursLogged", totalHours);

        // Task status breakdown
        Map<String, Long> taskStatusBreakdown = allTasks.stream()
            .collect(Collectors.groupingBy(
                t -> t.getStatus().toString(),
                Collectors.counting()
            ));
        report.put("taskStatusBreakdown", taskStatusBreakdown);

        // Project status breakdown
        Map<String, Long> projectStatusBreakdown = allProjects.stream()
            .collect(Collectors.groupingBy(
                p -> p.getStatus().toString(),
                Collectors.counting()
            ));
        report.put("projectStatusBreakdown", projectStatusBreakdown);

        return report;
    }

    /**
     * Generate project progress report
     */
    public Map<String, Object> generateProjectProgressReport() {
        List<Project> projects = projectRepository.findAll();
        
        List<Map<String, Object>> projectProgress = projects.stream()
            .map(project -> {
                Map<String, Object> data = new HashMap<>();
                data.put("id", project.getId());
                data.put("title", project.getTitle());
                data.put("progress", project.getProgressPercentage());
                data.put("status", project.getStatus().toString());
                return data;
            })
            .collect(Collectors.toList());

        Map<String, Object> report = new HashMap<>();
        report.put("projects", projectProgress);
        report.put("averageProgress", projects.stream()
            .mapToInt(Project::getProgressPercentage)
            .average()
            .orElse(0.0));

        return report;
    }

    /**
     * Generate time tracking report
     */
    public Map<String, Object> generateTimeTrackingReport() {
        List<TimeLog> timeLogs = timeLogRepository.findAll();

        // Hours by user
        Map<String, Double> hoursByUser = timeLogs.stream()
            .collect(Collectors.groupingBy(
                tl -> tl.getUser().getFullName(),
                Collectors.summingDouble(TimeLog::getHoursSpent)
            ));

        // Hours by date (last 7 days)
        LocalDate today = LocalDate.now();
        Map<String, Double> hoursByDate = timeLogs.stream()
            .filter(tl -> tl.getDate().isAfter(today.minusDays(7)))
            .collect(Collectors.groupingBy(
                tl -> tl.getDate().toString(),
                Collectors.summingDouble(TimeLog::getHoursSpent)
            ));

        Map<String, Object> report = new HashMap<>();
        report.put("hoursByUser", hoursByUser);
        report.put("hoursByDate", hoursByDate);
        report.put("totalHours", timeLogs.stream()
            .mapToDouble(TimeLog::getHoursSpent)
            .sum());

        return report;
    }

    /**
     * Generate task completion report
     */
    public Map<String, Object> generateTaskCompletionReport() {
        List<Task> tasks = taskRepository.findAll();

        long completedTasks = tasks.stream()
            .filter(t -> t.getStatus() == Task.TaskStatus.COMPLETED)
            .count();
        
        long totalTasks = tasks.size();
        double completionRate = totalTasks > 0 ? (completedTasks * 100.0) / totalTasks : 0;

        Map<String, Object> report = new HashMap<>();
        report.put("completedTasks", completedTasks);
        report.put("totalTasks", totalTasks);
        report.put("completionRate", completionRate);
        report.put("pendingTasks", totalTasks - completedTasks);

        return report;
    }

    /**
     * Generate team productivity report
     */
    public Map<String, Object> generateTeamProductivityReport() {
        List<User> users = userRepository.findAll();
        List<Task> tasks = taskRepository.findAll();
        List<TimeLog> timeLogs = timeLogRepository.findAll();

        List<Map<String, Object>> teamData = users.stream()
            .map(user -> {
                Map<String, Object> userData = new HashMap<>();
                userData.put("name", user.getFullName());
                
                long assignedTasks = tasks.stream()
                    .filter(t -> t.getAssignedUser() != null && t.getAssignedUser().getId().equals(user.getId()))
                    .count();
                
                long completedTasks = tasks.stream()
                    .filter(t -> t.getAssignedUser() != null && 
                                t.getAssignedUser().getId().equals(user.getId()) &&
                                t.getStatus() == Task.TaskStatus.COMPLETED)
                    .count();
                
                double hoursLogged = timeLogs.stream()
                    .filter(tl -> tl.getUser().getId().equals(user.getId()))
                    .mapToDouble(TimeLog::getHoursSpent)
                    .sum();

                userData.put("assignedTasks", assignedTasks);
                userData.put("completedTasks", completedTasks);
                userData.put("hoursLogged", hoursLogged);
                
                return userData;
            })
            .collect(Collectors.toList());

        Map<String, Object> report = new HashMap<>();
        report.put("teamMembers", teamData);

        return report;
    }
}
