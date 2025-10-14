import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { HashRouter } from 'react-router-dom';
import ReactGA from "react-ga4"; // <-- 1. Import thư viện

// 2. Khởi tạo Google Analytics với Measurement ID của bạn
// Thay thế "G-XXXXXXXXXX" bằng mã thật của bạn
ReactGA.initialize("G-XXXXXXXXXX"); 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);