import { Routes, Route } from 'react-router-dom';

// Import các component layout và route bảo vệ
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Import tất cả các trang cần thiết
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
// import WelcomePage from '../pages/WelcomePage'; // <-- Đã xóa, không cần nữa
import DashboardPage from '../pages/DashboardPage';
import ProductsPage from '../pages/ProductsPage';
import CustomerRevenuePage from '../pages/CustomerRevenuePage';
import NotFoundPage from '../pages/NotFoundPage';

function AppRoutes() {
  return (
    <Routes>
      {/* Nhóm 1: Các trang sử dụng Layout chung */}
      <Route element={<MainLayout />}>
        {/* Trang công khai */}
        <Route path="/" element={<HomePage />} />

        {/* Các trang cần đăng nhập (cho mọi vai trò đã đăng nhập) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/products" element={<ProductsPage />} />
          {/* 
            CustomerRevenuePage được chuyển vào đây để "Cửa Hàng", "Nhà Máy Tôn" 
            và "ad mind" đều có thể truy cập
          */}
          <Route path="/customer-revenue" element={<CustomerRevenuePage />} />
        </Route>

        {/* Các trang chỉ dành riêng cho Admin */}
        <Route element={<AdminRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Route>

      {/* Nhóm 2: Các trang không có layout */}
      <Route path="/login" element={<LoginPage />} />

      {/* Nhóm 3: Trang 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;