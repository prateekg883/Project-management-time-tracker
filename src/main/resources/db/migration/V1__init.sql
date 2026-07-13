-- Initial schema and seed data (converted from embedded H2 schema)

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    full_name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    project_id INT,
    assigned_user_id INT,
    status VARCHAR(20) DEFAULT 'TODO',
    due_date DATE,
    estimated_hours INT,
    version INT DEFAULT 0,
    CONSTRAINT fk_tasks_project FOREIGN KEY (project_id) REFERENCES projects(id),
    CONSTRAINT fk_tasks_assignee FOREIGN KEY (assigned_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS time_logs (
    id SERIAL PRIMARY KEY,
    task_id INT,
    user_id INT,
    date DATE NOT NULL,
    hours_spent NUMERIC(5,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_timelogs_task FOREIGN KEY (task_id) REFERENCES tasks(id),
    CONSTRAINT fk_timelogs_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Seed data
INSERT INTO users (username, password, role, email, full_name) VALUES
('admin', 'admin123', 'ADMIN', 'admin@timetracker.com', 'System Administrator'),
('pm1', 'pm123', 'PROJECT_MANAGER', 'pm1@timetracker.com', 'John Manager'),
('dev1', 'dev123', 'TEAM_MEMBER', 'dev1@timetracker.com', 'Alice Developer'),
('dev2', 'dev123', 'TEAM_MEMBER', 'dev2@timetracker.com', 'Bob Developer');

INSERT INTO projects (title, description, start_date, end_date, status) VALUES
('E-Commerce Platform', 'Building a modern e-commerce platform', '2024-01-01', '2024-06-30', 'ACTIVE'),
('Mobile App Development', 'Cross-platform mobile application', '2024-02-01', '2024-08-31', 'ACTIVE'),
('Data Analytics Dashboard', 'Business intelligence dashboard', '2024-03-01', '2024-09-30', 'ACTIVE');

INSERT INTO tasks (title, description, project_id, assigned_user_id, status, due_date, estimated_hours) VALUES
('Setup Database Schema', 'Design and implement database structure', 1, 3, 'COMPLETED', '2024-01-15', 16),
('User Authentication', 'Implement login and registration', 1, 3, 'IN_PROGRESS', '2024-01-30', 24),
('Product Catalog', 'Create product listing functionality', 1, 4, 'TODO', '2024-02-15', 32),
('UI/UX Design', 'Design mobile app interface', 2, 4, 'IN_PROGRESS', '2024-02-28', 40),
('API Integration', 'Connect mobile app to backend', 2, 3, 'TODO', '2024-03-15', 28),
('Chart Components', 'Implement data visualization charts', 3, 4, 'TODO', '2024-03-30', 20);

INSERT INTO time_logs (task_id, user_id, date, hours_spent, description) VALUES
(1, 3, '2024-01-10', 8.0, 'Initial database design and setup'),
(1, 3, '2024-01-11', 6.5, 'Created tables and relationships'),
(1, 3, '2024-01-12', 1.5, 'Testing and optimization'),
(2, 3, '2024-01-16', 7.0, 'Implemented basic login functionality'),
(2, 3, '2024-01-17', 5.5, 'Added password validation and security'),
(4, 4, '2024-02-05', 8.0, 'Created wireframes and mockups'),
(4, 4, '2024-02-06', 6.0, 'Designed user interface components');