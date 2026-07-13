package com.timetracker.service;

import com.timetracker.model.Project;
import com.timetracker.model.Task;
import com.timetracker.model.User;
import com.timetracker.repository.ProjectRepository;
import com.timetracker.repository.TaskRepository;
import com.timetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task getTaskById(Integer id) {
        if (id == null) throw new IllegalArgumentException("Task ID cannot be null");
        return taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    @Transactional
    public Task createTask(String title, String description, Integer projectId, Integer userId) {
        Task task = new Task();
        task.setTitle(title);
        task.setDescription(description);
        
        if (projectId != null) {
            Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
            task.setProject(project);
        }
        
        if (userId != null) {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            task.setAssignedUser(user);
        }
        
        return taskRepository.save(task);
    }

    @Transactional
    public Task updateTask(Integer id, String title, String description) {
        Task task = getTaskById(id);
        task.setTitle(title);
        task.setDescription(description);
        return taskRepository.save(task);
    }

    /**
     * ATOMIC TRANSACTION: Update task status AND recalculate project progress
     * Ensures data consistency between task and project records
     * Prevents concurrency errors by using single transaction
     */
    @Transactional
    public Task updateTaskStatus(Integer taskId, Task.TaskStatus newStatus) {
        // Step 1: Update task status
        Task task = getTaskById(taskId);
        task.setStatus(newStatus);
        task = taskRepository.save(task);

        // Step 2: If task belongs to a project, recalculate project progress atomically
        if (task.getProject() != null) {
            Project project = task.getProject();
            recalculateProjectProgress(project);
        }

        return task;
    }

    /**
     * Recalculate and update project progress percentage
     * Called within same transaction as task status update
     */
    private void recalculateProjectProgress(Project project) {
        List<Task> projectTasks = taskRepository.findByProjectId(project.getId());
        
        if (projectTasks.isEmpty()) {
            project.setProgressPercentage(0);
        } else {
            long completedTasks = projectTasks.stream()
                .filter(t -> t.getStatus() == Task.TaskStatus.COMPLETED)
                .count();
            
            int progressPercentage = (int) ((completedTasks * 100.0) / projectTasks.size());
            project.setProgressPercentage(progressPercentage);
        }
        
        projectRepository.save(project);
    }

    @Transactional
    public void deleteTask(Integer id) {
        if (id == null) throw new IllegalArgumentException("Task ID cannot be null");
        taskRepository.deleteById(id);
    }
}
