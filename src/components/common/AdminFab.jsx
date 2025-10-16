import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminFab.css';

// Danh sách các vai trò được coi là khách hàng (Cửa hàng, Nhà máy tôn)
const CUSTOMER_ROLES = ['Cửa Hàng', 'Nhà Máy Tôn'];

function AdminFab() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isSuperAdmin = user?.phan_loai === 'ad mind';
  // Kiểm tra xem có phải vai trò khách hàng không
  const isCustomerRole = user && CUSTOMER_ROLES.includes(user.phan_loai);

  return (
    <div className="fab-container">
      <div className={`fab-menu ${isOpen ? 'open' : ''}`}>
        <Link to="/products" className="fab-menu-item" onClick={() => setIsOpen(false)}>
          Sản phẩm
        </Link>
        
        {isSuperAdmin && (
          <Link to="/dashboard" className="fab-menu-item" onClick={() => setIsOpen(false)}>
            Bảng điều khiển (Dashboard)
          </Link>
        )}

        {/* --- THAY ĐỔI Ở ĐÂY --- */}
        {/* Chỉ hiển thị link này cho Cửa Hàng và Nhà Máy Tôn */}
        {isCustomerRole && (
          <Link to="/customer-revenue" className="fab-menu-item" onClick={() => setIsOpen(false)}>
            Doanh thu khách hàng
          </Link>
        )}
      </div>

      <button onClick={toggleMenu} className="fab-button">
        {isOpen ? '×' : '⚙︎'}
      </button>
    </div>
  );
}

export default AdminFab;