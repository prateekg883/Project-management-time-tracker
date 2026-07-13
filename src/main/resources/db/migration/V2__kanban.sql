-- Kanban schema: boards, columns, cards

CREATE TABLE IF NOT EXISTS boards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    owner_id INT REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS columns (
    id SERIAL PRIMARY KEY,
    board_id INT NOT NULL REFERENCES boards(id),
    name VARCHAR(200) NOT NULL,
    position INT NOT NULL
);

CREATE TABLE IF NOT EXISTS cards (
    id SERIAL PRIMARY KEY,
    column_id INT NOT NULL REFERENCES columns(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    assignee_id INT REFERENCES users(id),
    position INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version INT DEFAULT 0
);

-- Sample board and columns
INSERT INTO boards (name, owner_id) VALUES ('Default Board', 2);
INSERT INTO columns (board_id, name, position) VALUES (1, 'To Do', 1),(1, 'In Progress', 2),(1, 'Done', 3);

-- Sample card
INSERT INTO cards (column_id, title, description, assignee_id, position) VALUES (1, 'Sample Task', 'This is a sample Kanban card', 3, 1);
