-- Support Ticket Management System Seed Data
-- Database: support_tickets

USE support_tickets;

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE ticket_comments;
TRUNCATE TABLE tickets;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Password for all seed users is: password123
-- Hash computed with bcrypt (cost factor 10): $2b$10$7R.sH.JzM161O4M06w4KvuwQWnFzLgA5tK1Tz24r.JdFf3mB4T12G (or dynamic via Node script)
-- We will insert pre-hashed bcrypt strings for password123

INSERT INTO users (id, name, email, password_hash, role) VALUES
(1, 'John Customer', 'john@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer'),
(2, 'Sarah Customer', 'sarah@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer'),
(3, 'Alex Agent', 'alex.agent@support.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'agent'),
(4, 'Maria Support', 'maria.agent@support.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'agent');

-- Seed Tickets
INSERT INTO tickets (id, user_id, subject, description, priority, status, assigned_to, created_at) VALUES
(1, 1, 'Unable to access dashboard after password reset', 'I recently reset my password and now when I try to log in, I get redirected back to the login page without any error message.', 'high', 'in_progress', 3, NOW() - INTERVAL 2 DAY),
(2, 1, 'Billing query regarding invoice #INV-2026-89', 'Can you please provide a detailed breakdown of the taxes applied on my monthly subscription invoice for September?', 'low', 'open', NULL, NOW() - INTERVAL 1 DAY),
(3, 2, 'API rate limit error during bulk import', 'When running our automated data import script, we encounter HTTP 429 Too Many Requests errors after 100 requests.', 'medium', 'open', 4, NOW() - INTERVAL 5 HOUR),
(4, 2, 'Feature Request: Export tickets to PDF format', 'It would be extremely helpful for our compliance team if we could export individual support tickets into PDF documents.', 'low', 'closed', 3, NOW() - INTERVAL 5 DAY);

-- Seed Comments
INSERT INTO ticket_comments (id, ticket_id, user_id, comment, created_at) VALUES
(1, 1, 1, 'Hi team, any update on this issue? It is blocking my daily workflow.', NOW() - INTERVAL 1 DAY),
(2, 1, 3, 'Hello John! I am looking into your account logs right now. It appears to be a cached session token issue. Stand by while I reset your active session.', NOW() - INTERVAL 18 HOUR),
(3, 1, 1, 'Thank you Alex! Please let me know once I can test logging in again.', NOW() - INTERVAL 12 HOUR),
(4, 4, 2, 'Could you let us know if export to PDF is planned for Q4?', NOW() - INTERVAL 4 DAY),
(5, 4, 3, 'Hi Sarah, we have logged this feature request with our product team. Closing this ticket for now as a tracked request!', NOW() - INTERVAL 3 DAY);
