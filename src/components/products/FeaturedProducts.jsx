import React from 'react';
import { Link } from 'react-router-dom';
import './FeaturedProducts.css';
import { getProductImage } from '../../utils/imageLoader';

function FeaturedProducts({ prices }) {
  if (!prices || prices.length === 0) {
    return null;
  }

  return (
    <div className="featured-products-container">
      {prices.map(item => {
        // --- THAY ĐỔI CHÍNH Ở ĐÂY ---
        
        // 1. Lấy toàn bộ chuỗi tên file ảnh từ JSON
        const imageFileNamesString = item["image sản phẩm"] || '';
        
        // 2. Tách chuỗi thành mảng và lấy ra phần tử đầu tiên
        const firstImageName = imageFileNamesString.split(',')[0].trim();
        
        // 3. Dùng tên file đầu tiên đó để lấy ảnh
        const imageSrc = getProductImage(firstImageName);

        if (!item.product_slug) {
          return null;
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