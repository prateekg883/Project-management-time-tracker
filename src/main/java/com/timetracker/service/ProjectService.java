package com.timetracker.service;

import com.timetracker.model.Project;
import com.timetracker.model.User;
import com.timetracker.repository.ProjectRepository;
import com.timetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Integer id) {
        return projectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    @Transactional
    public Project createProject(String title, String description) {
        Project project = new Project();
        project.setTitle(title);
        project.setDescription(description);
        return projectRepository.save(project);
    }

    @Transactional
    public Project createProject(String name, String description, Integer managerId) {
        Project project = new Project();
        project.setTitle(name);
        project.setDescription(description);
        
        if (managerId != null) {
            User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found"));
            project.setManager(manager);
        }
        
        return projectRepository.save(project);
    }

    @Transactional
    public Project updateProject(Integer id, String title, String description) {
        Project project = getProjectById(id);
        project.setTitle(title);
        project.setDescription(description);
        return projectRepository.save(project);
    }

    @Transactional
    public void deleteProject(Integer id) {
        projectRepository.deleteById(id);
    }

    public List<Project> getProjectsByManager(Integer managerId) {
        return projectRepository.findByManagerId(managerId);
    }
}
