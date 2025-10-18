import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Danh sách các vai trò được phép truy cập
const ALLOWED_ROLES = ['ad mind'];

function AdminRoute() {
  const { user, isLoadingUsers } = useAuth();

  // Hiển thị loading trong khi chờ lấy thông tin user
  if (isLoadingUsers) {
    return <div>Verifying admin access...</div>;
  }

  // Kiểm tra xem người dùng đã đăng nhập VÀ có vai trò là 'ad mind' không
  if (user && ALLOWED_ROLES.includes(user.phan_loai)) {
    // Nếu hợp lệ, cho phép render trang con (DashboardPage)
    return <Outlet />;
  }

  // Nếu không hợp lệ (chưa đăng nhập hoặc sai vai trò), điều hướng về trang chủ
  return <Navigate to="/" replace />;
}

export default AdminRoute;