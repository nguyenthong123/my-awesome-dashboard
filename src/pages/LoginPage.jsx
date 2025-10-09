import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  // Chỉ cần một state duy nhất cho email
  const [email, setEmail] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Gọi hàm login chỉ với email
    const isSuccess = login(email);
    
    if (isSuccess) {
      navigate('/');
    }
  };

  // Giao diện đã được lược bỏ ô Tên đăng nhập
  return (
    <div>
      <h1>Đăng nhập</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email: </label>
          <input
            id="email"
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus // Tự động focus vào ô input này khi trang tải xong
          />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>
          Đăng nhập
        </button>
      </form>
    </div>
  );
}

export default LoginPage;