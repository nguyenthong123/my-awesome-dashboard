import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer'; // <-- 1. Import Footer
import AdminFab from '../common/AdminFab';
import { useAuth } from '../../context/AuthContext';

const FAB_VIEWER_ROLES = ['Cửa Hàng', 'Nhà Máy Tôn', 'ad mind'];

function MainLayout() {
  const { user } = useAuth();
  const canViewFab = user && FAB_VIEWER_ROLES.includes(user.phan_loai);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      {/* Thêm flexGrow: 1 để đẩy footer xuống cuối trang */}
      <main style={{ flexGrow: 1 }}>
        <Outlet />
      </main>
      
      {canViewFab && <AdminFab />}
      
      {/* 2. Thêm Footer vào đây */}
      <Footer />
    </div>
  );
}

export default MainLayout;