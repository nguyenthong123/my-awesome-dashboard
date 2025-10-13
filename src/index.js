import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// Bước 1: Import HashRouter thay vì BrowserRouter
import { HashRouter } from 'react-router-dom'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Bước 2: Sử dụng HashRouter để bọc App */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);