-- =============================================
-- PillMate Database Schema
-- Database: pillmate_db
-- =============================================

CREATE DATABASE IF NOT EXISTS pillmate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pillmate_db;

-- ---- Users ----
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    phone VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reset_otp VARCHAR(6),
    reset_otp_expiry DATETIME
);

-- ---- Medicines ----
CREATE TABLE IF NOT EXISTS medicines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    start_date DATE,
    end_date DATE,
    active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    category VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---- Medicine Intake Times (ElementCollection) ----
CREATE TABLE IF NOT EXISTS medicine_intake_times (
    medicine_id BIGINT NOT NULL,
    intake_time VARCHAR(20) NOT NULL,
    FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
);

-- ---- Intake History ----
CREATE TABLE IF NOT EXISTS intake_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    medicine_id BIGINT NOT NULL,
    medicine_name VARCHAR(200),
    taken_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('TAKEN', 'MISSED', 'SKIPPED') NOT NULL,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
);

-- ---- Prescriptions ----
CREATE TABLE IF NOT EXISTS prescriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    doctor_name VARCHAR(150),
    medicine_name VARCHAR(200),
    dosage VARCHAR(100),
    instructions TEXT,
    issued_date DATE,
    expiry_date DATE,
    image_url VARCHAR(500),
    active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---- Sample Admin User (password: admin123) ----
INSERT IGNORE INTO users (name, email, password, role)
VALUES ('Admin', 'admin@pillmate.com',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN');
