import React from 'react';
import Header from '../components/layout/Header'; // <-- Import Header
import { useAuth } from '../context/AuthContext'; // Import useAuth để lấy thông tin user

function HomePage() {
  // Lấy thông tin user để có thể hiển thị nội dung cá nhân hóa
  const { user } = useAuth();

  return (
    <div>
      <Header /> {/* <-- Hiển thị Header ở đây */}
      
      <main style={{ padding: '1rem' }}>
        <h1>Welcome to the Home Page</h1>
        
        {/* Hiển thị thông tin user nếu đã đăng nhập */}
        {user ? (
          <div>
            <p>Đây là trang chủ. Bạn đã đăng nhập với vai trò là: <strong>{user.phan_loai}</strong></p>
            {/* Dựa vào vai trò, chúng ta có thể hiển thị các component khác nhau ở đây */}
          </div>
        ) : (
          <p>Vui lòng đăng nhập để xem nội dung.</p> // Dòng này thực tế sẽ không bao giờ hiển thị vì đã có ProtectedRoute
        )}
      </main>
    </div>
  );
}

export default HomePage;