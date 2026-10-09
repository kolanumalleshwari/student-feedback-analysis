-- ============================================================
-- Student Feedback Analysis System - Database Initialization
-- ============================================================

-- Step 1: Create Database
CREATE DATABASE IF NOT EXISTS student_feedback_db;
USE student_feedback_db;

-- Step 2: Create Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    year_of_study VARCHAR(20) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    faculty_name VARCHAR(100) NOT NULL,
    teaching_rating INT NOT NULL CHECK (teaching_rating BETWEEN 1 AND 5),
    course_content_rating INT NOT NULL CHECK (course_content_rating BETWEEN 1 AND 5),
    communication_rating INT NOT NULL CHECK (communication_rating BETWEEN 1 AND 5),
    overall_rating INT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    comments TEXT,
    sentiment ENUM('Positive', 'Neutral', 'Negative') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Insert Sample Seed Data for Demonstration & Initial Testing
INSERT INTO feedback 
(student_name, student_id, department, year_of_study, subject, faculty_name, teaching_rating, course_content_rating, communication_rating, overall_rating, comments, sentiment, created_at)
VALUES 
('Alex Johnson', 'STU1001', 'Computer Science', '3rd Year', 'Data Structures & Algorithms', 'Dr. Alan Turing', 5, 5, 4, 5, 'The course materials were excellent and explanations were extremely clear and helpful!', 'Positive', NOW() - INTERVAL 10 DAY),
('Sophia Martinez', 'STU1002', 'Computer Science', '3rd Year', 'Web Development', 'Prof. Ada Lovelace', 5, 4, 5, 5, 'Amazing hands-on projects and great mentorship throughout the semester.', 'Positive', NOW() - INTERVAL 8 DAY),
('Ethan Brown', 'STU1003', 'Electrical Engineering', '2rd Year', 'Circuit Theory', 'Dr. Nikola Tesla', 2, 3, 2, 2, 'The lectures were confusing and the lab sessions felt very rushed and difficult.', 'Negative', NOW() - INTERVAL 7 DAY),
('Emma Watson', 'STU1004', 'Mechanical Engineering', '4th Year', 'Thermodynamics', 'Prof. James Watt', 3, 3, 3, 3, 'Average experience. The textbook covered most topics adequately.', 'Neutral', NOW() - INTERVAL 5 DAY),
('Liam Wilson', 'STU1005', 'Civil Engineering', '1st Year', 'Structural Analysis', 'Dr. Isambard Brunel', 4, 5, 4, 4, 'Very solid explanations and supportive faculty members.', 'Positive', NOW() - INTERVAL 4 DAY),
('Noah Davis', 'STU1006', 'Computer Science', '2nd Year', 'Database Management Systems', 'Prof. Edgar Codd', 1, 2, 1, 1, 'Poor organization of lectures and disappointing feedback on assignments.', 'Negative', NOW() - INTERVAL 3 DAY),
('Ava Taylor', 'STU1007', 'Information Technology', '3rd Year', 'Cloud Computing', 'Dr. Werner Vogels', 5, 5, 5, 5, 'Fantastic practical insights, helpful exercises, and outstanding guidance.', 'Positive', NOW() - INTERVAL 2 DAY),
('Lucas Miller', 'STU1008', 'Electronics & Communication', '4th Year', 'Digital Signal Processing', 'Prof. Claude Shannon', 3, 4, 3, 3, 'The subject matter is interesting but the pace was not good in initial weeks.', 'Negative', NOW() - INTERVAL 1 DAY);
