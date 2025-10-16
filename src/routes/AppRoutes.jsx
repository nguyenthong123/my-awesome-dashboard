import { Routes, Route } from 'react-router-dom';

// Import các component layout và route bảo vệ
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import SalesRoute from './SalesRoute'; // <-- Import route mới

// Import tất cả các trang
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
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

        {/* Trang cần đăng nhập chung */}
        <Route element={<ProtectedRoute />}>
          <Route path="/products" element={<ProductsPage />} />
        </Route>
        
        {/* Trang chỉ cho Đối tác Bán hàng */}
        <Route element={<SalesRoute />}>
          <Route path="/customer-revenue" element={<CustomerRevenuePage />} />
        </Route>

        {/* Trang chỉ cho Admin */}
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