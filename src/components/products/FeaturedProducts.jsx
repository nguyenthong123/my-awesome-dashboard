import React from 'react';
import './FeaturedProducts.css'; // <-- Bước 1: Import file CSS

// Component này bây giờ chỉ chứa logic render, không còn chứa CSS nữa.
function FeaturedProducts({ prices }) {
  if (!prices || prices.length === 0) {
    return null;
  }

  return (
    // Bước 2: Thay thế `style={...}` bằng `className="..."`
    <div className="featured-products-container">
      {prices.map(item => (
        <div key={item.id_san_pham} className="product-card">
          <div className="product-card-image-wrapper">
            <img 
              src={item["image sản phẩm"]} 
              alt={item["Tên sản phẩm"]} 
              className="product-card-image" 
              // Thêm onError để xử lý nếu link ảnh bị lỗi
              onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/280x180?text=No+Image"; }}
            />
          </div>
          <div className="product-card-content">
            <h3 className="product-card-title">{item["Tên sản phẩm"]}</h3>
            
            {/* Bước 3: Thêm các thông tin mới */}
            <p className="product-card-info">
              <strong>Kích thước:</strong> {item["kích thước"] || 'N/A'}
            </p>
            <p className="product-card-info">
              <strong>Số kg/tấm:</strong> {item["số kg trên tấm"] || 'N/A'}
            </p>
            
            <p className="product-card-price">
              Giá từ: {item["Giá chủ nhà"]?.toLocaleString('vi-VN') || 'Liên hệ'} VNĐ
            </p>
            <button className="product-card-button">Chi tiết</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeaturedProducts;