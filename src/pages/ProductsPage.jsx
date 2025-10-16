// src/pages/ProductsPage.jsx

import React, { useState, useMemo, useEffect } from 'react';
import useFetchData from '../hooks/useFetchData';
import { useAuth } from '../context/AuthContext';
import './ProductsPage.css';
import TabSlider from '../components/products/TabSlider';
import duraflexLogo from '../assets/images/duraflex-logo.png';
// *** ĐƯỜNG DẪN ĐÚNG LÀ ĐÂY ***
import { getProductImage } from '../utils/imageLoader';
// ... (phần còn lại của file giữ nguyên)

const PRODUCTS_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/products.json';
const PRICES_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/prices.json';
const ADVANCED_ROLES = ['Cửa Hàng', 'Nhà Máy Tôn', 'ad mind'];
const SPECIAL_PRICE_TYPES = ['giá niêm yết', 'Giá Thầu Thợ', 'Giá chủ nhà'];

function ProductsPage() {
  const { user } = useAuth();
  
  // *** KHÔI PHỤC LẠI CÁC DÒNG BỊ THIẾU ***
  const { data: products, isLoading: isLoadingProducts } = useFetchData(PRODUCTS_URL);
  const { data: prices, isLoading: isLoadingPrices } = useFetchData(PRICES_URL);
  
  const [selectedPriceType, setSelectedPriceType] = useState('Giá chủ nhà');

  const availablePriceTypes = useMemo(() => {
    if (!prices) return [];
    const priceKeys = new Set();
    const excludedKeys = ['group_id', 'id_san_pham', 'Tên sản phẩm', 'kích thước', 'số kg trên tấm', 'số tấm /kiện', 'image sản phẩm'];
    prices.forEach(price => { Object.keys(price).forEach(key => { if (!excludedKeys.includes(key) && price[key]) priceKeys.add(key); }); });
    return Array.from(priceKeys);
  }, [prices]);

  useEffect(() => {
    if (!availablePriceTypes.length) return;
    if (user?.phan_loai === 'Thầu Thợ') { setSelectedPriceType('Giá chủ nhà'); }
    else if (ADVANCED_ROLES.includes(user?.phan_loai)) {
      const defaultPrice = availablePriceTypes.find(p => p.toLowerCase().includes('niêm yết')) || availablePriceTypes[0];
      setSelectedPriceType(defaultPrice);
    }
  }, [user, availablePriceTypes]);

  if (isLoadingProducts || isLoadingPrices || !products || !prices) {
    return <div className="page-container">Loading product details...</div>;
  }
  
  const combinedData = Object.values(products).map(product => ({
    ...product,
    variants: prices.filter(price => price.group_id === product.id),
  }));

  const shouldShowNotes = SPECIAL_PRICE_TYPES.includes(selectedPriceType);

  return (
    <>
      <div className="page-container">
        <h1>Bảng Giá Sản Phẩm</h1>
        <p>Hiển thị giá theo vai trò của bạn: <strong>{user?.phan_loai}</strong></p>

        <div className="price-selector-container">
          {user?.phan_loai === 'Thầu Thợ' ? (
            <>
              <button className={`price-selector-button ${selectedPriceType === 'Giá chủ nhà' ? 'active' : ''}`} onClick={() => setSelectedPriceType('Giá chủ nhà')}>Giá chủ nhà</button>
              <button className={`price-selector-button ${selectedPriceType === 'Giá Thầu Thợ' ? 'active' : ''}`} onClick={() => setSelectedPriceType('Giá Thầu Thợ')}>Giá Thầu Thợ</button>
            </>
          ) : ADVANCED_ROLES.includes(user?.phan_loai) ? availablePriceTypes.map(priceType => (
            <button key={priceType} className={`price-selector-button ${selectedPriceType === priceType ? 'active' : ''}`} onClick={() => setSelectedPriceType(priceType)}>{priceType}</button>
          )) : null }
        </div>

        {combinedData.map(product => (
          product.variants.length > 0 && (
            <div key={product.id} className="product-group">
              <div className="product-group-title">
                {product.id.includes('duraflex') && <img src={duraflexLogo} alt="DURAfex Logo" className="logo" />}
                <h2>{product.name}</h2>
              </div>
              <div className="table-container">
                <table className="product-price-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>Hình ảnh</th>
                      <th>Tên sản phẩm</th>
                      <th>Kích thước</th>
                      <th>Số kg / tấm</th>
                      <th>Số tấm / kiện</th>
                      <th>Giá ({selectedPriceType})</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.variants.map(variant => {
                      const imageSrc = getProductImage(variant["image sản phẩm"]);
                      return (
                        <tr key={variant.id_san_pham}>
                          <td className="product-image-cell">
                            <img 
                              src={imageSrc} 
                              alt={variant["Tên sản phẩm"]} 
                              className="product-image" 
                              onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/60x40?text=No+Img"; }}
                            />
                          </td>
                          <td>{variant["Tên sản phẩm"]}</td>
                          <td>{variant["kích thước"]}</td>
                          <td>{variant["số kg trên tấm"]}</td>
                          <td>{variant["số tấm /kiện"]}</td>
                          <td className="price-cell">
                            {variant[selectedPriceType] ? `${variant[selectedPriceType].toLocaleString('vi-VN')} VNĐ` : ''}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ))}

        {shouldShowNotes && (
          <div className="notes-section">
            <h3>Lưu ý:</h3>
            <ul>
              <li>Miễn phí vận chuyển với tổng đơn hàng &gt;= 5,5 tr ; đơn hàng dưới 5,5 tr phí vận chuyển cần cộng thêm 250 ngàn/ đơn .</li>
              <li>Đơn giá đã được sự chấp thuận của các đại lý phân phối ( Hoàng Sa Phước An , Phú Cường Cư M'gar, Ngọc Linh Cư kuin,Xuân Quỳnh Tuy Đức ,Trường Thọ tp.bmt.,nmt Buôn Ma Thuột ).</li>
              <li>Sản phẩm luôn có QR chính hãng được dán trên tấm.</li>
              <li>© 2024 - DURAfex Vinh Tường. Mọi quyền được bảo lưu.</li>
            </ul>
          </div>
        )}
      </div>
      <TabSlider />
    </>
  );
}

export default ProductsPage;