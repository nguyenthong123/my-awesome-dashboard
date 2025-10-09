import { Routes, Route } from 'react-router-dom';

// Import tất cả các component trang cần thiết
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import WelcomePage from '../pages/WelcomePage';
import DashboardPage from '../pages/DashboardPage';
import ProductsPage from '../pages/ProductsPage';
import NotFoundPage from '../pages/NotFoundPage';

// Import component bảo vệ
import ProtectedRoute from './ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      {/* ===== CÁC ROUTE CÔNG KHAI ===== */}
      {/* Ai cũng có thể truy cập các route này */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* ===== CÁC ROUTE ĐƯỢC BẢO VỆ ===== */}
      {/* Chỉ người dùng đã đăng nhập mới có thể truy cập các route bên trong */}
      <Route element={<ProtectedRoute />}>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Route>

      {/* ===== ROUTE 404 ===== */}
      {/* Bắt tất cả các đường dẫn không khớp */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;