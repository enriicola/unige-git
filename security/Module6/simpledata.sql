#DROP DATABASE course;
CREATE DATABASE course;
USE course;
CREATE TABLE Courses (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL, teacheremail VARCHAR(100) NOT NULL);
INSERT INTO Courses (name, teacheremail) VALUES ('Course1', 'teacher1@unige.it'), ('Course2', 'teacher2@unige.it'), ('Course3', 'teacher3@unige.it');
CREATE TABLE Students (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, username VARCHAR(100) NOT NULL, password VARCHAR(100) NOT NULL, email VARCHAR(100) UNIQUE NOT NULL);
INSERT INTO Students (username, password, email) VALUES ('mrossi', '1bwVkSVxiejj', 'mario.rossi@unige.it'), ('sbianchi', 'TmI63pd1vft4', 'stefano.bianchi@unige.it'), ('cverdi', 'BfRLRJzy2Jpx', 'carlo.verdi@unige.it');
