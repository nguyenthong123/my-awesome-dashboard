import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';
import AdminFab from '../common/AdminFab';

// Danh sách các vai trò có thể nhìn thấy nút FAB
const FAB_VIEWER_ROLES = ['Cửa Hàng', 'Nhà Máy Tôn', 'ad mind'];

function MainLayout() {
  const { user } = useAuth(); // Lấy thông tin người dùng

  // Kiểm tra xem vai trò của người dùng có nằm trong danh sách được phép xem FAB không
  const canViewFab = user && FAB_VIEWER_ROLES.includes(user.phan_loai);

  return (
    <div>
      <Header />
      <main>
        {/* Nội dung của các trang con sẽ được render ở đây */}
        <Outlet />
      </main>
      
      {/* Chỉ hiển thị nút FAB nếu người dùng có quyền */}
      {canViewFab && <AdminFab />}
    </div>
  );
}

export default MainLayout;