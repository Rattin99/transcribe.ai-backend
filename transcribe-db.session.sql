-- Active: 1714922665604@@sql6.freesqldatabase.com@3306@sql6704225


CREATE TABLE user(
    id VARCHAR(100) PRIMARY KEY NOT NULL,
    uid INT AUTO_INCREMENT UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(100) NOT NULL,
    phone INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
CREATE TABLE transcribe_data(
    id VARCHAR(100) PRIMARY KEY,
    uid int AUTO_INCREMENT UNIQUE,
    transcribe TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    meeting_id VARCHAR(100),
    Foreign Key (meeting_id) REFERENCES user_meetings(id) ON UPDATE CASCADE ON DELETE SET NULL
)

ALTER TABLE transcribe_data 
ADD COLUMN createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP


CREATE TABLE notes_data(
    id VARCHAR(100) PRIMARY KEY,
    uid int AUTO_INCREMENT UNIQUE,
    notes TEXT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    meeting_id VARCHAR(100),
    Foreign Key (meeting_id) REFERENCES user_meetings(id) ON UPDATE CASCADE ON DELETE SET NULL
)

CREATE TABLE summary_data(
    id VARCHAR(100) PRIMARY KEY,
    uid int AUTO_INCREMENT UNIQUE,
    summary TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    meeting_id VARCHAR(100),
    Foreign Key (meeting_id) REFERENCES user_meetings(id) ON UPDATE CASCADE ON DELETE SET NULL
)

CREATE TABLE user_meetings (
    id VARCHAR(100)  PRIMARY KEY,
    uid int AUTO_INCREMENT UNIQUE,
    meeting_name text NOT NULL,
    user_id VARCHAR(100),
    Foreign Key (user_id) REFERENCES user(id) ON UPDATE CASCADE ON DELETE SET NULL
)
