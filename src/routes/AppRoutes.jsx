import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
// Import các trang khác khi bạn tạo chúng sau

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Route này sẽ bắt tất cả các đường dẫn không khớp */}
      <Route path="*" element={<NotFoundPage />} /> 
    </Routes>
  );
}

export default AppRoutes;