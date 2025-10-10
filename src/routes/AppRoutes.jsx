import { Routes, Route } from 'react-router-dom';

// Import layouts and routes
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Import pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import WelcomePage from '../pages/WelcomePage';
import DashboardPage from '../pages/DashboardPage';
import ProductsPage from '../pages/ProductsPage';
import CustomerRevenuePage from '../pages/CustomerRevenuePage'; // <-- THÊM DÒNG NÀY
import NotFoundPage from '../pages/NotFoundPage';

function AppRoutes() {
  return (
    <Routes>
      {/* Nhóm 1: Các trang sử dụng Layout chung */}
      <Route element={<MainLayout />}>
        {/* Trang công khai */}
        <Route path="/" element={<HomePage />} />

        {/* Các trang cần đăng nhập */}
        <Route element={<ProtectedRoute />}>
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Route>

        {/* Các trang cần quyền Admin */}
        <Route element={<AdminRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/customer-revenue" element={<CustomerRevenuePage />} /> {/* <-- THÊM DÒNG NÀY */}
        </Route>
      </Route>

      {/* Nhóm 2: Các trang không sử dụng Layout chung (ví dụ: trang Login toàn màn hình) */}
      <Route path="/login" element={<LoginPage />} />

      {/* Nhóm 3: Trang 404 (nên đặt ở ngoài cùng và cuối cùng) */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;