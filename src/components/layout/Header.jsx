import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Header.css';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-logo">
          <Link to="/" onClick={closeMenu}>
            DURAflex Tây Nguyên
          </Link>
        </div>

        {/* --- Menu cho máy tính --- */}
        <nav className="header-nav-desktop">
          <button onClick={toggleTheme} className="theme-toggle-button">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {user ? (
            <>
              <span>Chào, {user.name}</span>
              <button className="logout-button" onClick={handleLogout}>Đăng xuất</button>
            </>
          ) : (
            <Link to="/login">Đăng nhập</Link>
          )}
        </nav> {/* <-- ĐÃ SỬA LỖI, THÊM DẤU > */}

        {/* --- Nút Hamburger cho điện thoại --- */}
        <button 
          className="hamburger-menu" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </header>
      
      {/* --- Menu trượt ra và Lớp phủ cho điện thoại --- */}
      <div 
        className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`} 
        onClick={closeMenu}
      ></div>
      
      <nav className={`header-nav-mobile ${isMobileMenuOpen ? 'open' : ''}`}>
        <button onClick={toggleTheme} className="theme-toggle-button-mobile">
          Chuyển sang Giao diện {theme === 'light' ? 'Tối' : 'Sáng'}
        </button>

        {user ? (
          <>
            <span>Chào, {user.name} ({user.phan_loai})</span>
            <button className="logout-button" onClick={handleLogout}>Đăng xuất</button>
          </>
        ) : (
          <Link 
            to="/login" 
            onClick={closeMenu} 
            className="login-link-mobile"
          >
            Đăng nhập
          </Link>
        )}
      </nav>
    </>
  );
}

export default Header;