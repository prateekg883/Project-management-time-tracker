package com.timetracker.service;

import com.timetracker.model.Task;
import com.timetracker.model.TimeLog;
import com.timetracker.model.User;
import com.timetracker.repository.TaskRepository;
import com.timetracker.repository.TimeLogRepository;
import com.timetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class TimeLogService {

    @Autowired
    private TimeLogRepository timeLogRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public List<TimeLog> getAllTimeLogs() {
        return timeLogRepository.findAll();
    }

    public TimeLog getTimeLogById(Integer id) {
        if (id == null) throw new IllegalArgumentException("TimeLog ID cannot be null");
        return timeLogRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("TimeLog not found"));
    }

    @Transactional
    public TimeLog createTimeLog(Integer taskId, Integer userId, LocalDate date, Double hours, String description) {
        if (taskId == null) throw new IllegalArgumentException("Task ID cannot be null");
        if (userId == null) throw new IllegalArgumentException("User ID cannot be null");
        
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        TimeLog timeLog = new TimeLog(task, user, date, hours, description);
        return timeLogRepository.save(timeLog);
    }

    @Transactional
    public void deleteTimeLog(Integer id) {
        if (id == null) throw new IllegalArgumentException("TimeLog ID cannot be null");
        timeLogRepository.deleteById(id);
    }

    public Double getTotalHours() {
        List<TimeLog> logs = timeLogRepository.findAll();
        return logs.stream()
            .mapToDouble(TimeLog::getHoursSpent)
            .sum();
    }
}
