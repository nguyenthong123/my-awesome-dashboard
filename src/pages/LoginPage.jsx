import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css'; // <-- Import file CSS mới

// --- Import các tài sản ---
import homeIcon from '../assets/icons/home-icon.png';

import houseImage from '../assets/images/login-background-house.png'; // Hoặc .jpg

const TABS = ["Xem doanh số", "Xem bảng giá new", "Xem biểu đồ doanh thu", "Xem chiết khấu"];

function LoginPage() {
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); 
    const isSuccess = login(email);
    if (isSuccess) {
      navigate('/'); 
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* --- Cột bên trái --- */}
        <div className="login-form-section">
          <nav className="login-tabs">
            {TABS.map(tab => (
              <button 
                key={tab}
                className={`login-tab-button ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
          
          <div className="login-title-section">
            <Link to="/">
              <img src={homeIcon} alt="Home Icon" className="home-icon" />
            </Link>
            <h1>Đăng nhập</h1>
          </div>
          
          <p className="login-instructions">
            Chào mừng trở lại! Vui lòng nhập email của bạn để tiếp tục.
          </p>
          
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            <button type="submit">
              Đăng nhập
            </button>
          </form>
        </div>

        {/* --- Cột bên phải --- */}
        <div className="login-image-section">
          <img src={houseImage} alt="Beautiful house" />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;