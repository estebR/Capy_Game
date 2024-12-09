-- Create the database
CREATE DATABASE CapyGame;

-- Switch to the game database
USE CapyGame;

-- Create the leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_name VARCHAR(255) NOT NULL UNIQUE,
    score INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
