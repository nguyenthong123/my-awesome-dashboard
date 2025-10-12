import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminFab.css'; // <-- Import file CSS mới

function AdminFab() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isSuperAdmin = user?.phan_loai === 'ad mind';

  return (
    <div className="fab-container">
      {/* Thêm class 'open' khi menu được mở */}
      <div className={`fab-menu ${isOpen ? 'open' : ''}`}>
        <Link to="/products" className="fab-menu-item" onClick={() => setIsOpen(false)}>
          Sản phẩm
        </Link>
        
        {isSuperAdmin && (
          <Link to="/dashboard" className="fab-menu-item" onClick={() => setIsOpen(false)}>
            Bảng điều khiển (Dashboard)
          </Link>
        )}

        <Link to="/customer-revenue" className="fab-menu-item" onClick={() => setIsOpen(false)}>
          Doanh thu khách hàng
        </Link>
      </div>

      <button onClick={toggleMenu} className="fab-button">
        {/* Sử dụng ký tự Unicode cho icon, trông sắc nét hơn emoji */}
        {isOpen ? '×' : '⚙︎'}
      </button>
    </div>
  );
}

export default AdminFab;