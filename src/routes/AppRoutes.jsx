import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/WelcomePage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute'; // <-- Bước 1: Import

function AppRoutes() {
  return (
    <Routes>
      {/* Route cho trang Login, ai cũng vào được */}
      <Route path="/login" element={<LoginPage />} />

      {/* Route được bảo vệ */}
      <Route element={<ProtectedRoute />}> {/* <-- Bước 2: Bọc các route cần bảo vệ */}
        {/* Tất cả các Route bên trong này sẽ được bảo vệ */}
        <Route path="/" element={<HomePage />} />
        {/* Sau này bạn có thể thêm các trang khác cần bảo vệ ở đây */}
        {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
        {/* <Route path="/products" element={<ProductsPage />} /> */}
      </Route>

      {/* Route cho trang 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;