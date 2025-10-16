import React from 'react';
import './FeaturedProducts.css'; // <-- BƯỚC 1: ĐẢM BẢO DÒNG NÀY TỒN TẠI
import { getProductImage } from '../../utils/imageLoader';

function FeaturedProducts({ prices }) {
  if (!prices || prices.length === 0) {
    return null;
  }

  return (
    // BƯỚC 2: SỬ DỤNG ĐÚNG className
    <div className="featured-products-container">
      {prices.map(item => {
        const imageSrc = getProductImage(item["image sản phẩm"]);

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
              <button className="product-card-button">Chi tiết</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FeaturedProducts;