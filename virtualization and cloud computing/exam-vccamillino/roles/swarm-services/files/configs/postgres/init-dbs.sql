-- PostgreSQL database initialization script
-- This script will be executed when the PostgreSQL container starts for the first time

-- Create any databases or users as needed
-- Example:
-- CREATE DATABASE myapp;
-- CREATE USER myapp_user WITH PASSWORD 'myapp_password';
-- GRANT ALL PRIVILEGES ON DATABASE myapp TO myapp_user;

-- For now, just ensure the script exists to avoid mount errors
SELECT 'PostgreSQL initialization script loaded' as message;
