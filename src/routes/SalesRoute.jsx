import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Danh sách các vai trò được phép truy cập
const ALLOWED_ROLES = ['Cửa Hàng', 'Nhà Máy Tôn'];

function SalesRoute() {
  const { user, isLoadingUsers } = useAuth();

  if (isLoadingUsers) {
    return <div>Verifying access...</div>;
  }

  // Kiểm tra xem người dùng đã đăng nhập VÀ vai trò của họ có trong danh sách được phép không
  if (user && ALLOWED_ROLES.includes(user.phan_loai)) {
    // Nếu hợp lệ, cho phép render trang con (CustomerRevenuePage)
    return <Outlet />;
  }

  // Nếu không hợp lệ (chưa đăng nhập hoặc sai vai trò), điều hướng về trang chủ
  return <Navigate to="/" replace />;
}

export default SalesRoute;