import { Routes, Route } from 'react-router-dom';

// Import các component layout và route bảo vệ
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import SalesRoute from './SalesRoute';

// Import tất cả các trang
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ProductsPage from '../pages/ProductsPage';
import CustomerRevenuePage from '../pages/CustomerRevenuePage';
import ProductDetailPage from '../pages/ProductDetailPage'; // <-- THÊM DÒNG NÀY
import NotFoundPage from '../pages/NotFoundPage';

function AppRoutes() {
  return (
    <Routes>
      {/* Nhóm 1: Các trang sử dụng Layout chung */}
      <Route element={<MainLayout />}>
        {/* === CÁC TRANG CÔNG KHAI === */}
        {/* Ai cũng có thể truy cập */}
        <Route path="/" element={<HomePage />} />
        <Route path="/san-pham/:slug" element={<ProductDetailPage />} /> {/* <-- THÊM DÒNG NÀY */}

        {/* === CÁC TRANG CẦN ĐĂNG NHẬP (MỌI VAI TRÒ) === */}
        <Route element={<ProtectedRoute />}>
          <Route path="/products" element={<ProductsPage />} />
        </Route>
        
        {/* === CÁC TRANG CHỈ CHO ĐỐI TÁC BÁN HÀNG === */}
        <Route element={<SalesRoute />}>
          <Route path="/customer-revenue" element={<CustomerRevenuePage />} />
        </Route>

        {/* === CÁC TRANG CHỈ CHO ADMIN === */}
        <Route element={<AdminRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Route>

      {/* Nhóm 2: Các trang không có layout */}
      <Route path="/login" element={<LoginPage />} />

      {/* Nhóm 3: Trang 404 (luôn đặt cuối cùng) */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;