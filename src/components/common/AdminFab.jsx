import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// --- Khai báo CSS chi tiết ---
const fabContainerStyle = {
  position: 'fixed',
  bottom: '30px',
  left: '30px',
  zIndex: 1000,
};

const fabButtonStyle = {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
};

const menuStyle = {
  position: 'absolute',
  bottom: '80px',
  left: '0',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  minWidth: '200px',
};

const linkStyle = {
  textDecoration: 'none',
  color: '#333',
  padding: '8px 12px',
  borderRadius: '4px',
  display: 'block',
};
// --- Hết phần CSS ---

function AdminFab() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isSuperAdmin = user?.phan_loai === 'ad mind';

  return (
    <div style={fabContainerStyle}>
      {isOpen && (
        <div style={menuStyle}>
          <Link to="/products" style={linkStyle} onClick={() => setIsOpen(false)}>
            Sản phẩm
          </Link>
          
          {isSuperAdmin && (
            <Link to="/dashboard" style={linkStyle} onClick={() => setIsOpen(false)}>
              Bảng điều khiển (Dashboard)
            </Link>
          )}

          <Link to="/customer-revenue" style={linkStyle} onClick={() => setIsOpen(false)}>
            Doanh thu khách hàng
          </Link>
        </div>
      )}

      <button onClick={toggleMenu} style={fabButtonStyle}>
        {isOpen ? '✕' : '⚙️'}
      </button>
    </div>
  );
}

export default AdminFab;