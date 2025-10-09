import React from 'react';
import Header from '../components/layout/Header';

function DashboardPage() {
  return (
    <div>
      <Header />
      <main style={{ padding: '1rem' }}>
        <h1>Admin Dashboard</h1>
        <p>Đây là khu vực quản trị.</p>
      </main>
    </div>
  );
}

export default DashboardPage;