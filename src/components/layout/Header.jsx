import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// CSS giữ nguyên
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem',
  backgroundColor: '#f8f9fa',
  borderBottom: '1px solid #dee2e6',
};
const navStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
};

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={headerStyle}>
      {/* Link về trang chủ công khai */}
      <Link to="/" style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>
        My Awesome Dashboard
      </Link>

      <nav style={navStyle}>
        {user ? (
          // Giao diện khi đã đăng nhập (đã được dọn dẹp)
          <>
            {/* LINK "SẢN PHẨM" VÀ "DASHBOARD" ĐÃ ĐƯỢC XÓA */}
            
            <span>Chào, {user.name} ({user.phan_loai})</span>
            <button onClick={handleLogout}>Đăng xuất</button>
          </>
        ) : (
          // Giao diện khi chưa đăng nhập
          <Link to="/login">Đăng nhập</Link>
        )}
      </nav>
    </header>
  );
}

export default Header;