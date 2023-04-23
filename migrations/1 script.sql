-- Active: 1681488123530@@127.0.0.1@3306@course_management

DROP DATABASE IF EXISTS course_management;
CREATE DATABASE course_management;
USE course_management;

-- tables
CREATE TABLE users (
    user_id INT AUTO_INCREMENT,
    username VARCHAR(30),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    password TEXT,
    role ENUM("student", "admin", "lecturer"),
    PRIMARY KEY (user_id)
);

CREATE TABLE courses (
    course_id INT AUTO_INCREMENT,
    course_code VARCHAR(10) UNIQUE,
    course_name VARCHAR(50),
    course_description VARCHAR(255),
    PRIMARY KEY (course_id) 
);

CREATE TABLE student_courses (
    course_id INT,
    student_id INT,
    grade FLOAT,
    PRIMARY KEY (course_id, student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    FOREIGN KEY (student_id) REFERENCES users(user_id)
);


CREATE TABLE lecturer_courses (
    course_id INT,
    lecturer_id INT,
    PRIMARY KEY (course_id, lecturer_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    FOREIGN KEY (lecturer_id) REFERENCES users(user_id)
);


CREATE TABLE events (
    event_id INT AUTO_INCREMENT,
    course_id INT,
    created_by INT,
    created_date datetime default CURRENT_TIMESTAMP,
    event_title VARCHAR(30),
    event_description VARCHAR(255),
    PRIMARY KEY (event_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

CREATE TABLE forums (
    forum_id INT AUTO_INCREMENT,
    course_id INT,
    created_by INT,
    forum_title VARCHAR(30),
    forum_description VARCHAR(255),
    PRIMARY KEY (forum_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id), 
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

CREATE TABLE threads (
    thread_id INT AUTO_INCREMENT,
    forum_id INT,
    parent_thread_id INT,
    created_by INT,
    thread_content VARCHAR(255),
    PRIMARY KEY (thread_id),
    FOREIGN KEY (forum_id) REFERENCES forums(forum_id),
    FOREIGN KEY (parent_thread_id) REFERENCES threads(thread_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

CREATE TABLE sections (
    section_id INT AUTO_INCREMENT,
    course_id INT,
    section_title VARCHAR(30),
    section_description VARCHAR(255),
    PRIMARY KEY (section_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE TABLE course_contents (
    course_content_id INT AUTO_INCREMENT,
    section_id INT,
    course_content VARCHAR(255),
    PRIMARY KEY (course_content_id),
    FOREIGN KEY (section_id) REFERENCES sections(section_id)
);

CREATE TABLE course_content_files (
    file_id INT AUTO_INCREMENT,
    course_content_id INT,
    file_url VARCHAR(255),
    PRIMARY KEY (file_id),
    FOREIGN KEY (course_content_id) REFERENCES course_contents(course_content_id)
);

CREATE TABLE assignments (
    assignment_id INT AUTO_INCREMENT,
    course_id INT,
    assignment_title VARCHAR(30),
    assignment_description VARCHAR(255),
    PRIMARY KEY (assignment_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE TABLE submissions (
    submission_id INT AUTO_INCREMENT,
    assignment_id INT,
    student_id INT,
    submission_content VARCHAR(255),
    grade INT,
    PRIMARY KEY (submission_id),
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id),
    FOREIGN KEY (student_id) REFERENCES users(user_id)
);

CREATE TABLE submission_files (
    submission_file_id INT AUTO_INCREMENT,
    submission_id INT,
    submission_file_url VARCHAR(255),
    PRIMARY KEY (submission_file_id),
    FOREIGN KEY (submission_id) REFERENCES submissions(submission_id)
);

-- views 

-- all courses that have more than 50 students
CREATE VIEW course_ids_with_50_or_more_students AS
SELECT course_id, COUNT(student_id) AS num_students 
FROM student_courses
GROUP BY course_id
HAVING num_students >= 50;


CREATE VIEW courses_with_50_or_more_students AS
SELECT c.* 
FROM courses c
JOIN course_ids_with_50_or_more_students s ON c.course_id = s.course_id;

-- students that do 5 or more courses
CREATE VIEW student_ids_with_5_or_more_courses AS
SELECT student_id, COUNT(course_id) AS num_courses
FROM student_courses
GROUP BY student_id
HAVING num_courses >= 5;

CREATE VIEW students_with_5_or_more_courses AS 
SELECT s.*
FROM users s 
JOIN student_ids_with_5_or_more_courses ss ON s.user_id = ss.student_id AND s.role = 'student';

-- all lecturers who teach 3 or more courses.
CREATE VIEW lecturer_ids_with_3_or_more_courses AS 
SELECT lecturer_id, COUNT(course_id) AS num_courses
FROM lecturer_courses
GROUP BY lecturer_id
HAVING num_courses >= 3;

CREATE VIEW lecturers_with_3_or_more_courses AS
SELECT u.*, l.num_courses 
FROM users u 
JOIN lecturer_ids_with_3_or_more_courses l ON u.user_id = l.lecturer_id AND u.role = 'lecturer';

-- top 10 enrolled courses
CREATE VIEW top_10_enrolled_courses AS
SELECT c.* , COUNT(sc.student_id) AS num_students
FROM courses c
JOIN student_courses sc ON c.course_id = sc.course_id
GROUP BY c.course_id
ORDER BY COUNT(sc.student_id) DESC
LIMIT 10;

-- top 10 students with highest average 
CREATE VIEW top_10_students_with_highest_averages AS
SELECT u.*, AVG(s.grade) AS average_grade
FROM users u
JOIN submissions s ON u.user_id = s.student_id
GROUP BY u.user_id
ORDER BY AVG(s.grade) DESC
LIMIT 10;
