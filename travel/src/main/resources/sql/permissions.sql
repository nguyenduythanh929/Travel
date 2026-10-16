-- =============================================
-- SQL Script: Insert Permissions for Travel API
-- =============================================

-- Clear existing permissions (optional - uncomment if needed)
-- DELETE FROM role_permission;
-- DELETE FROM permissions;

-- =============================================
-- DASHBOARD PERMISSIONS
-- =============================================
INSERT INTO permissions (id, code, name, module, description, created_at, updated_at) VALUES
(1, 'DASHBOARD_VIEW', 'Xem Dashboard', 'DASHBOARD', 'Quyền xem trang tổng quan', NOW(), NOW());

-- =============================================
-- USER PERMISSIONS
-- =============================================
INSERT INTO permissions (id, code, name, module, description, created_at, updated_at) VALUES
(2, 'USER_VIEW', 'Xem người dùng', 'USER', 'Quyền xem danh sách và chi tiết người dùng', NOW(), NOW()),
(3, 'USER_CREATE', 'Tạo người dùng', 'USER', 'Quyền tạo người dùng mới', NOW(), NOW()),
(4, 'USER_EDIT', 'Sửa người dùng', 'USER', 'Quyền chỉnh sửa thông tin người dùng', NOW(), NOW()),
(5, 'USER_DELETE', 'Xóa người dùng', 'USER', 'Quyền xóa người dùng', NOW(), NOW());

-- =============================================
-- TOUR PERMISSIONS
-- =============================================
INSERT INTO permissions (id, code, name, module, description, created_at, updated_at) VALUES
(6, 'TOUR_VIEW', 'Xem tour (Admin)', 'TOUR', 'Quyền xem tour trong trang quản trị', NOW(), NOW()),
(7, 'TOUR_CREATE', 'Tạo tour', 'TOUR', 'Quyền tạo tour mới', NOW(), NOW()),
(8, 'TOUR_EDIT', 'Sửa tour', 'TOUR', 'Quyền chỉnh sửa tour', NOW(), NOW()),
(9, 'TOUR_DELETE', 'Xóa tour', 'TOUR', 'Quyền xóa tour', NOW(), NOW());

-- =============================================
-- TOUR TYPE PERMISSIONS
-- =============================================
INSERT INTO permissions (id, code, name, module, description, created_at, updated_at) VALUES
(10, 'TOUR_TYPE_VIEW', 'Xem danh mục tour', 'TOUR_TYPE', 'Quyền xem danh mục tour trong trang quản trị', NOW(), NOW()),
(11, 'TOUR_TYPE_CREATE', 'Tạo danh mục tour', 'TOUR_TYPE', 'Quyền tạo danh mục tour mới', NOW(), NOW()),
(12, 'TOUR_TYPE_EDIT', 'Sửa danh mục tour', 'TOUR_TYPE', 'Quyền chỉnh sửa danh mục tour', NOW(), NOW()),
(13, 'TOUR_TYPE_DELETE', 'Xóa danh mục tour', 'TOUR_TYPE', 'Quyền xóa danh mục tour', NOW(), NOW());

-- =============================================
-- BOOKING PERMISSIONS
-- =============================================
INSERT INTO permissions (id, code, name, module, description, created_at, updated_at) VALUES
(14, 'BOOKING_VIEW', 'Xem đơn đặt tour', 'BOOKING', 'Quyền xem danh sách đơn đặt tour', NOW(), NOW()),
(15, 'BOOKING_EDIT', 'Sửa đơn đặt tour', 'BOOKING', 'Quyền chỉnh sửa đơn đặt tour', NOW(), NOW()),
(16, 'BOOKING_DELETE', 'Xóa đơn đặt tour', 'BOOKING', 'Quyền xóa đơn đặt tour', NOW(), NOW());

-- =============================================
-- ROLE PERMISSIONS
-- =============================================
INSERT INTO permissions (id, code, name, module, description, created_at, updated_at) VALUES
(17, 'ROLE_VIEW', 'Xem vai trò', 'ROLE', 'Quyền xem danh sách vai trò và quyền', NOW(), NOW()),
(18, 'ROLE_CREATE', 'Tạo vai trò', 'ROLE', 'Quyền tạo vai trò mới', NOW(), NOW()),
(19, 'ROLE_EDIT', 'Sửa vai trò', 'ROLE', 'Quyền chỉnh sửa vai trò', NOW(), NOW()),
(20, 'ROLE_DELETE', 'Xóa vai trò', 'ROLE', 'Quyền xóa vai trò', NOW(), NOW());

-- =============================================
-- VOUCHER PERMISSIONS
-- =============================================
INSERT INTO permissions (id, code, name, module, description, created_at, updated_at) VALUES
(21, 'VOUCHER_VIEW', 'Xem voucher', 'VOUCHER', 'Quyền xem danh sách voucher', NOW(), NOW()),
(22, 'VOUCHER_CREATE', 'Tạo voucher', 'VOUCHER', 'Quyền tạo voucher mới', NOW(), NOW()),
(23, 'VOUCHER_EDIT', 'Sửa voucher', 'VOUCHER', 'Quyền chỉnh sửa voucher', NOW(), NOW()),
(24, 'VOUCHER_DELETE', 'Xóa voucher', 'VOUCHER', 'Quyền xóa voucher', NOW(), NOW());

-- =============================================
-- CONTACT PERMISSIONS
-- =============================================
INSERT INTO permissions (id, code, name, module, description, created_at, updated_at) VALUES
(25, 'CONTACT_VIEW', 'Xem liên hệ', 'CONTACT', 'Quyền xem danh sách liên hệ', NOW(), NOW()),
(26, 'CONTACT_DELETE', 'Xóa liên hệ', 'CONTACT', 'Quyền xóa liên hệ', NOW(), NOW());

-- =============================================
-- REVIEW PERMISSIONS
-- =============================================
INSERT INTO permissions (id, code, name, module, description, created_at, updated_at) VALUES
(27, 'REVIEW_VIEW', 'Xem đánh giá', 'REVIEW', 'Quyền xem danh sách đánh giá trong admin', NOW(), NOW()),
(28, 'REVIEW_DELETE', 'Xóa đánh giá', 'REVIEW', 'Quyền xóa đánh giá', NOW(), NOW());

-- =============================================
-- WEBSITE SETTING PERMISSIONS
-- =============================================
INSERT INTO permissions (id, code, name, module, description, created_at, updated_at) VALUES
(29, 'SETTING_VIEW', 'Xem cài đặt website', 'SETTING', 'Quyền xem cài đặt website', NOW(), NOW()),
(30, 'SETTING_EDIT', 'Sửa cài đặt website', 'SETTING', 'Quyền chỉnh sửa cài đặt website', NOW(), NOW());

-- =============================================
-- ASSIGN ALL PERMISSIONS TO ADMIN ROLE (assuming role_id = 1 is ADMIN)
-- =============================================
-- First, clear existing permissions for admin role
DELETE FROM role_permission WHERE role_id = 1;

-- Assign all permissions to admin
INSERT INTO role_permission (role_id, permission_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(1, 6), (1, 7), (1, 8), (1, 9), (1, 10),
(1, 11), (1, 12), (1, 13), (1, 14), (1, 15),
(1, 16), (1, 17), (1, 18), (1, 19), (1, 20),
(1, 21), (1, 22), (1, 23), (1, 24), (1, 25),
(1, 26), (1, 27), (1, 28), (1, 29), (1, 30);

-- =============================================
-- SAMPLE: Create Staff Role with limited permissions
-- =============================================
-- INSERT INTO roles (id, code, name, description, created_at, updated_at) VALUES
-- (2, 'STAFF', 'Nhân viên', 'Nhân viên quản lý tour và booking', NOW(), NOW());

-- INSERT INTO role_permission (role_id, permission_id) VALUES
-- (2, 6), (2, 7), (2, 8),      -- TOUR: VIEW, CREATE, EDIT
-- (2, 14), (2, 15),            -- BOOKING: VIEW, EDIT
-- (2, 25);                      -- CONTACT: VIEW
