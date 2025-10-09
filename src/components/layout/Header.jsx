import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// CSS đơn giản để Header trông đẹp hơn một chút
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
  gap: '1rem', // Khoảng cách giữa các phần tử
};

function Header() {
  // Lấy thông tin người dùng và hàm logout từ context
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Gọi hàm logout từ context
    navigate('/login'); // Điều hướng người dùng về trang login sau khi đăng xuất
  };

  return (
    <header style={headerStyle}>
      {/* Link về trang chủ */}
      <Link to="/" style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>
        My Awesome Dashboard
      </Link>

      <nav style={navStyle}>
        {/* Chúng ta sẽ thêm các link điều hướng khác ở đây sau */}
        {/* Ví dụ: <Link to="/products">Products</Link> */}
        
        {/* Kiểm tra xem user đã đăng nhập hay chưa */}
        {user ? (
          // Nếu đã đăng nhập, hiển thị thông tin và nút Logout
          <>
            <span>Chào, {user.name} ({user.phan_loai})</span>
            <button onClick={handleLogout}>Đăng xuất</button>
          </>
        ) : (
          // Nếu chưa đăng nhập, hiển thị link tới trang Login
          <Link to="/login">Đăng nhập</Link>
        )}
      </nav>
    </header>
  );
}

export default Header;