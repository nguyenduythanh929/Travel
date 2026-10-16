-- Demo accounts for trying out the apps (passwords are listed in README.md).
--   user@travel.com  / User@123456   -> customer website (role USER)
--   admin@travel.com / Admin@123456  -> admin dashboard  (role ADMIN)
-- Safe to run more than once: existing emails are skipped.

INSERT INTO users (name, email, password, status, created_by, updated_by)
SELECT 'Demo User', 'user@travel.com',
       '$2a$10$/JEcsUNur46.6LKgCdT5H.0VLf.ZbQAvvXQTnzAQAq5SQj5gUZiUm', 1, 'system', 'system'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'user@travel.com');

INSERT INTO users (name, email, password, status, created_by, updated_by)
SELECT 'Demo Admin', 'admin@travel.com',
       '$2a$10$f3xW.8oZbR5JtnTypiroje1n7sQZesk0CimJzG.zOmTLkPCORYAgq', 1, 'system', 'system'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@travel.com');

INSERT INTO user_role (user_id, role_id)
SELECT u.id, r.id FROM users u JOIN roles r ON r.code = 'USER'
WHERE u.email = 'user@travel.com'
  AND NOT EXISTS (SELECT 1 FROM user_role ur WHERE ur.user_id = u.id);

INSERT INTO user_role (user_id, role_id)
SELECT u.id, r.id FROM users u JOIN roles r ON r.code = 'ADMIN'
WHERE u.email = 'admin@travel.com'
  AND NOT EXISTS (SELECT 1 FROM user_role ur WHERE ur.user_id = u.id);
