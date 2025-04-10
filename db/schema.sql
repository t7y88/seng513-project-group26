-- User Table
CREATE TABLE User (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(255) UNIQUE,
    role VARCHAR(50),
    hikes_completed INT DEFAULT 0,
    hikes_time_total INT DEFAULT 0,
    hikes_elevation_total INT DEFAULT 0
);

-- Friendship Table
CREATE TABLE Friendship (
    username1 VARCHAR(50),
    username2 VARCHAR(50),
    since DATE,
    PRIMARY KEY (username1, username2),
    FOREIGN KEY (username1) REFERENCES User(username) ON DELETE CASCADE,
    FOREIGN KEY (username2) REFERENCES User(username) ON DELETE CASCADE
);

-- Hike Table
CREATE TABLE Hike (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    difficulty VARCHAR(50),
    avg_rating INT DEFAULT 0
);

-- Completion Table
CREATE TABLE Completion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hike_id INT,
    username VARCHAR(50),
    duration INT, -- in minutes
    distance INT, -- in meters
    elevation INT, -- in meters
    FOREIGN KEY (hike_id) REFERENCES Hike(id) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES User(username) ON DELETE CASCADE,
    UNIQUE (hike_id, username)
);

-- Review Table
CREATE TABLE Review (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    hike_id INT,
    rating INT CHECK(rating >= 1 AND rating <= 5),
    comments TEXT,
    FOREIGN KEY (hike_id) REFERENCES Hike(id) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES User(username) ON DELETE CASCADE
);

-- Post Table
CREATE TABLE Post (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50),
    posted_on DATE DEFAULT CURRENT_DATE,
    title VARCHAR(255),
    description TEXT,
    FOREIGN KEY (username) REFERENCES User(username) ON DELETE CASCADE
);

-- Comment Table
CREATE TABLE Comment (
    id VARCHAR(50) PRIMARY KEY,
    post_id VARCHAR(50),
    username VARCHAR(50),
    text TEXT,
    since DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (post_id) REFERENCES Post(id) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES User(username) ON DELETE CASCADE
);

-- Optional: Added some indexes to optimize queries
CREATE INDEX idx_user_email ON User(email);
CREATE INDEX idx_hike_name ON Hike(name);
CREATE INDEX idx_completion_username ON Completion(username);