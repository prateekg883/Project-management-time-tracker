package com.timetracker.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.timetracker.model.*;
import com.timetracker.repository.*;

import java.time.LocalDate;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BoardRepository boardRepository;
    
    @Autowired
    private KanbanColumnRepository columnRepository;
    
    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TimeLogRepository timeLogRepository;

    @Override
    public void run(String... args) throws Exception {
        // Create users
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword("admin123");
        admin.setRole(UserRole.ADMIN);
        admin.setEmail("admin@timetracker.com");
        admin.setFullName("System Administrator");
        userRepository.save(admin);

        // Demo users for login page
        User alice = new User();
        alice.setUsername("alice");
        alice.setPassword("alice123");
        alice.setRole(UserRole.ADMIN);
        alice.setEmail("alice@timetracker.com");
        alice.setFullName("Alice Johnson");
        userRepository.save(alice);

        User bob = new User();
        bob.setUsername("bob");
        bob.setPassword("bob123");
        bob.setRole(UserRole.TEAM_MEMBER);
        bob.setEmail("bob@timetracker.com");
        bob.setFullName("Bob Smith");
        userRepository.save(bob);

        User charlie = new User();
        charlie.setUsername("charlie");
        charlie.setPassword("charlie123");
        charlie.setRole(UserRole.PROJECT_MANAGER);
        charlie.setEmail("charlie@timetracker.com");
        charlie.setFullName("Charlie Brown");
        userRepository.save(charlie);

        User pm1 = new User();
        pm1.setUsername("pm1");
        pm1.setPassword("pm123");
        pm1.setRole(UserRole.PROJECT_MANAGER);
        pm1.setEmail("pm1@timetracker.com");
        pm1.setFullName("John Manager");
        userRepository.save(pm1);

        User dev1 = new User();
        dev1.setUsername("dev1");
        dev1.setPassword("dev123");
        dev1.setRole(UserRole.TEAM_MEMBER);
        dev1.setEmail("dev1@timetracker.com");
        dev1.setFullName("Alice Developer");
        userRepository.save(dev1);

        // Create board
        Board board = new Board();
        board.setName("Default Board");
        board.setOwner(pm1);
        boardRepository.save(board);

        // Create columns
        KanbanColumn col1 = new KanbanColumn();
        col1.setBoard(board);
        col1.setName("To Do");
        col1.setPosition(1);
        columnRepository.save(col1);

        KanbanColumn col2 = new KanbanColumn();
        col2.setBoard(board);
        col2.setName("In Progress");
        col2.setPosition(2);
        columnRepository.save(col2);

        KanbanColumn col3 = new KanbanColumn();
        col3.setBoard(board);
        col3.setName("Done");
        col3.setPosition(3);
        columnRepository.save(col3);

        // Create sample cards
        Card card1 = new Card();
        card1.setColumn(col1);
        card1.setTitle("Sample Task 1");
        card1.setDescription("This is a sample Kanban card");
        card1.setAssignee(dev1);
        card1.setPosition(1);
        cardRepository.save(card1);

        Card card2 = new Card();
        card2.setColumn(col1);
        card2.setTitle("Sample Task 2");
        card2.setDescription("Another sample task");
        card2.setAssignee(dev1);
        card2.setPosition(2);
        cardRepository.save(card2);

        Card card3 = new Card();
        card3.setColumn(col2);
        card3.setTitle("In Progress Task");
        card3.setDescription("Currently being worked on");
        card3.setAssignee(dev1);
        card3.setPosition(1);
        cardRepository.save(card3);

        // Create projects
        Project project1 = new Project("E-Commerce Platform", "Building an online shopping platform", LocalDate.now().minusMonths(2), LocalDate.now().plusMonths(4));
        projectRepository.save(project1);

        Project project2 = new Project("Mobile App", "iOS and Android mobile application", LocalDate.now().minusMonths(1), LocalDate.now().plusMonths(3));
        projectRepository.save(project2);

        Project project3 = new Project("Dashboard Redesign", "Modernizing the admin dashboard", LocalDate.now(), LocalDate.now().plusMonths(2));
        projectRepository.save(project3);

        // Create tasks
        Task task1 = new Task("Setup Database", "Configure PostgreSQL and migrations", project1, dev1, LocalDate.now().plusDays(7), 8);
        taskRepository.save(task1);

        Task task2 = new Task("User Authentication", "Implement JWT authentication", project1, dev1, LocalDate.now().plusDays(14), 16);
        taskRepository.save(task2);

        Task task3 = new Task("UI Design", "Create mockups and wireframes", project2, pm1, LocalDate.now().plusDays(5), 12);
        taskRepository.save(task3);

        Task task4 = new Task("API Integration", "Connect frontend to backend APIs", project2, dev1, LocalDate.now().plusDays(21), 20);
        taskRepository.save(task4);

        // Create time logs
        TimeLog log1 = new TimeLog(task1, dev1, LocalDate.now().minusDays(2), 8.0, "Initial database setup completed");
        timeLogRepository.save(log1);

        TimeLog log2 = new TimeLog(task2, dev1, LocalDate.now().minusDays(1), 6.5, "JWT implementation in progress");
        timeLogRepository.save(log2);

        TimeLog log3 = new TimeLog(task3, pm1, LocalDate.now().minusDays(3), 8.0, "Created initial wireframes");
        timeLogRepository.save(log3);

        TimeLog log4 = new TimeLog(task1, dev1, LocalDate.now(), 4.0, "Database optimization and indexing");
        timeLogRepository.save(log4);

        System.out.println("Sample data loaded successfully!");
        System.out.println("Created 6 users, 1 board, 3 columns, 3 cards, 3 projects, 4 tasks, and 4 time logs");
        System.out.println("Demo accounts - alice/alice123 (Admin), bob/bob123 (User), charlie/charlie123 (PM)");
    }
}
