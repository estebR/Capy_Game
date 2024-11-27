

-- Create the database
CREATE DATABASE IF NOT EXISTS game;

-- Switch to the game database
USE game;

-- Create the leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_name VARCHAR(255) NOT NULL,
    score INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

