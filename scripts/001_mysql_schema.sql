-- LEADFLOW CRM - PRODUCTION MYSQL SCHEMA
CREATE DATABASE IF NOT EXISTS leadflow;
USE leadflow;

-- USERS TABLE
CREATE DATABASE IF NOT EXISTS leadflow;
USE leadflow;
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- LEADS TABLE
CREATE TABLE IF NOT EXISTS leads (
  id CHAR(36) PRIMARY KEY,

  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),

  source VARCHAR(50) DEFAULT 'website',

  status ENUM('new', 'contacted', 'qualified', 'converted', 'lost')
    NOT NULL DEFAULT 'new',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_leads_status (status),
  INDEX idx_leads_created_at (created_at),
  INDEX idx_leads_email (email)
) ENGINE=InnoDB;

-- LEAD NOTES TABLE
CREATE TABLE IF NOT EXISTS lead_notes (
  id CHAR(36) PRIMARY KEY,

  lead_id CHAR(36) NOT NULL,
  created_by CHAR(36) NULL,

  content TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_lead_notes_lead_id (lead_id),
  INDEX idx_lead_notes_created_by (created_by),

  CONSTRAINT fk_lead_notes_lead
    FOREIGN KEY (lead_id)
    REFERENCES leads(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_lead_notes_user
    FOREIGN KEY (created_by)
    REFERENCES users(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;