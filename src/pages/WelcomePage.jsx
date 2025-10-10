import React from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link để tạo điều hướng
import { useAuth } from '../context/AuthContext';

// Danh sách các vai trò admin
const ADMIN_ROLES = ['Cửa Hàng', 'Nhà Máy Tôn', 'ad mind'];

function WelcomePage() {
  // Lấy thông tin user
  const { user } = useAuth();

  // Kiểm tra xem user có phải là admin không
  const isAdmin = user && ADMIN_ROLES.includes(user.phan_loai);

  // function HomePage() đã được đổi thành function WelcomePage()
  // export default HomePage đã được đổi thành export default WelcomePage
  return (
    <div style={{ padding: '1rem' }}>
      <h1>Chào mừng trở lại, {user?.name}!</h1>
      
      <p>Bạn đã đăng nhập với vai trò là: <strong>{user?.phan_loai}</strong></p>

      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
        <h3>Lối tắt nhanh:</h3>
        
        {/* Link đến trang sản phẩm, ai đăng nhập cũng thấy */}
        <Link to="/products" style={{ fontSize: '1.2rem' }}>
          Xem Bảng Giá Sản Phẩm
        </Link>
        
        {/* Link đến trang Dashboard, chỉ admin mới thấy */}
        {isAdmin && (
          <Link to="/dashboard" style={{ fontSize: '1.2rem' }}>
            Truy cập Dashboard Quản trị
          </Link>
        )}
      </div>
    </div>
  );
}

export default WelcomePage;