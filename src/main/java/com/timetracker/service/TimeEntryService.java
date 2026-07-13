package com.timetracker.service;

import com.timetracker.model.Task;
import com.timetracker.model.TimeEntry;
import com.timetracker.model.User;
import com.timetracker.repository.TaskRepository;
import com.timetracker.repository.TimeEntryRepository;
import com.timetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Duration;
import java.util.List;

@Service
public class TimeEntryService {

    @Autowired
    private TimeEntryRepository timeEntryRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public List<TimeEntry> getAllTimeEntries() {
        return timeEntryRepository.findAll();
    }

    public TimeEntry getTimeEntryById(Integer id) {
        return timeEntryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Time entry not found"));
    }

    @Transactional
    public TimeEntry startTimeEntry(Integer taskId, Integer userId, String description) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        TimeEntry timeEntry = new TimeEntry();
        timeEntry.setTask(task);
        timeEntry.setUser(user);
        timeEntry.setDescription(description);
        timeEntry.setStartTime(LocalDateTime.now());
        
        return timeEntryRepository.save(timeEntry);
    }

    @Transactional
    public TimeEntry stopTimeEntry(Integer id) {
        TimeEntry timeEntry = getTimeEntryById(id);
        
        if (timeEntry.getEndTime() != null) {
            throw new RuntimeException("Time entry already stopped");
        }
        
        timeEntry.setEndTime(LocalDateTime.now());
        
        // Calculate duration in minutes
        Duration duration = Duration.between(timeEntry.getStartTime(), timeEntry.getEndTime());
        timeEntry.setDuration(duration.toMinutes());
        
        return timeEntryRepository.save(timeEntry);
    }

    @Transactional
    public TimeEntry updateTimeEntry(Integer id, String description) {
        TimeEntry timeEntry = getTimeEntryById(id);
        timeEntry.setDescription(description);
        return timeEntryRepository.save(timeEntry);
    }

    @Transactional
    public void deleteTimeEntry(Integer id) {
        timeEntryRepository.deleteById(id);
    }

    public List<TimeEntry> getTimeEntriesByUser(Integer userId) {
        return timeEntryRepository.findByUserId(userId);
    }

    public List<TimeEntry> getTimeEntriesByTask(Integer taskId) {
        return timeEntryRepository.findByTaskId(taskId);
    }

    public Long getTotalTimeByTask(Integer taskId) {
        return timeEntryRepository.findByTaskId(taskId).stream()
            .mapToLong(TimeEntry::getDuration)
            .sum();
    }
}
