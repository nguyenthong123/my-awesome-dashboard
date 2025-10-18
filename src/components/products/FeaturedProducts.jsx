import React from 'react';
import { Link } from 'react-router-dom'; // <-- 1. Import Link từ react-router-dom
import './FeaturedProducts.css';
import { getProductImage } from '../../utils/imageLoader';

function FeaturedProducts({ prices }) {
  if (!prices || prices.length === 0) {
    return null;
  }

  return (
    <div className="featured-products-container">
      {prices.map(item => {
        const imageSrc = getProductImage(item["image sản phẩm"]);

        // Kiểm tra xem sản phẩm có slug không trước khi render
        if (!item.product_slug) {
          return null; // Bỏ qua không hiển thị các sản phẩm chưa có slug
        }

        return (
          <div key={item.id_san_pham} className="product-card">
            <div className="product-card-image-wrapper">
              <img 
                src={imageSrc} 
                alt={item["Tên sản phẩm"]} 
                className="product-card-image"
                onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/280x180?text=No+Image"; }}
              />
            </div>
            <div className="product-card-content">
              <h3 className="product-card-title">{item["Tên sản phẩm"]}</h3>
              <p className="product-card-info">Kích thước: {item["kích thước"] || 'N/A'}</p>
              <p className="product-card-info">Số kg/tấm: {item["số kg trên tấm"] || 'N/A'}</p>
              <p className="product-card-price">
                Giá từ: {item["Giá chủ nhà"]?.toLocaleString('vi-VN') || 'Liên hệ'} VNĐ
              </p>
              
              {/* 2. Thay thế <button> bằng <Link> */}
              <Link to={`/san-pham/${item.product_slug}`} className="product-card-button">
                Chi tiết
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FeaturedProducts;