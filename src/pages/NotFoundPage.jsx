import React from 'react';
import { Link } from 'react-router-dom';

const pageStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80vh',
  textAlign: 'center',
};

const titleStyle = {
  fontSize: '6rem',
  fontWeight: 'bold',
  margin: 0,
  color: 'var(--primary-green)',
};

const linkStyle = {
  marginTop: '1.5rem',
  padding: '10px 20px',
  backgroundColor: 'var(--primary-blue)',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '6px',
};

function NotFoundPage() {
  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>404</h1>
      <h2>Page Not Found</h2>
      <p>Xin lỗi, trang bạn đang tìm kiếm không tồn tại.</p>
      <Link to="/" style={linkStyle}>Quay về Trang chủ</Link>
    </div>
  );
}

export default NotFoundPage;