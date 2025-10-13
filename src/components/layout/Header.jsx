import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
          DURAflex  Tây Nguyên
        </Link>
      </div>

      {/* --- Menu cho máy tính --- */}
      <nav className="header-nav-desktop">
        {user ? (
          <>
            <span>Chào, {user.name}</span>
            <button className="logout-button" onClick={handleLogout}>Đăng xuất</button>
          </>
        ) : (
          <Link to="/login">Đăng nhập</Link>
        )}
      </nav>

      {/* --- Nút Hamburger và Menu cho điện thoại --- */}
      <button 
        className="hamburger-menu" 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Thêm class 'open' khi isMobileMenuOpen là true */}
      <nav className={`header-nav-mobile ${isMobileMenuOpen ? 'open' : ''}`}>
        {user ? (
          // KHI ĐÃ ĐĂNG NHẬP
          <>
            <span>Chào, {user.name} ({user.phan_loai})</span>
            <button className="logout-button" onClick={handleLogout}>Đăng xuất</button>
          </>
        ) : (
          // KHI CHƯA ĐĂNG NHẬP (PHẦN BỊ THIẾU)
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Đăng nhập</Link>
        )}
      </nav>
    </header>
  );
}

export default Header;