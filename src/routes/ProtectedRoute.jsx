import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
  // Lấy thông tin người dùng từ AuthContext
  const { user, isLoadingUsers } = useAuth();

  // Trường hợp 1: Dữ liệu người dùng đang được tải
  // Hiển thị một thông báo loading để tránh bị nhảy trang đột ngột
  if (isLoadingUsers) {
    return <div>Loading user data...</div>;
  }

  // Trường hợp 2: Dữ liệu đã tải xong và KHÔNG có người dùng nào đăng nhập
  if (!user) {
    // Nếu không có user, điều hướng họ về trang login
    return <Navigate to="/login" replace />; 
    // `replace` giúp người dùng không thể nhấn "Back" để quay lại trang đã bị chặn
  }
  
  // Trường hợp 3: Dữ liệu đã tải xong và CÓ người dùng đăng nhập
  // Cho phép hiển thị nội dung của trang được bảo vệ
  return <Outlet />;
  // <Outlet /> là một placeholder đặc biệt của react-router-dom, 
  // nó sẽ render component con của route (ví dụ: HomePage)
}

export default ProtectedRoute;