import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumbs.css';

// Component này nhận vào một mảng các "mẩu bánh mì"
// Mỗi mẩu là một object { label: 'Tên hiển thị', link: '/duong-dan' }
// Mẩu cuối cùng sẽ không có link
function Breadcrumbs({ crumbs }) {
  if (!crumbs || crumbs.length === 0) {
    return null;
  }

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumbs">
        {crumbs.map((crumb, index) => (
          <li key={index} className={`breadcrumbs-item ${index === crumbs.length - 1 ? 'active' : ''}`}>
            {index < crumbs.length - 1 ? (
              // Nếu không phải là mẩu cuối cùng, hiển thị Link
              <Link to={crumb.link}>{crumb.label}</Link>
            ) : (
              // Nếu là mẩu cuối cùng, chỉ hiển thị text
              <span>{crumb.label}</span>
            )}
            {/* Hiển thị dấu phân cách, trừ mẩu cuối cùng */}
            {index < crumbs.length - 1 && <span className="breadcrumbs-separator">&gt;</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;