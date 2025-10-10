import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Danh sách các vai trò được phép truy cập
const ALLOWED_ROLES = ['ad mind'];

function AdminRoute() {
  const { user, isLoadingUsers } = useAuth();

  // Vẫn hiển thị loading trong khi chờ xác thực
  if (isLoadingUsers) {
    return <div>Verifying access...</div>;
  }

  // Kiểm tra xem người dùng đã đăng nhập VÀ vai trò của họ có trong danh sách được phép không
  if (user && ALLOWED_ROLES.includes(user.phan_loai)) {
    // Nếu hợp lệ, cho phép render trang con (DashboardPage)
    return <Outlet />;
  }

  // Nếu không hợp lệ (chưa đăng nhập hoặc sai vai trò), điều hướng về trang welcome
  // Chúng ta có thể hiển thị một thông báo "Không có quyền truy cập" ở trang welcome sau này
  return <Navigate to="/welcome" replace />;
}

export default AdminRoute;