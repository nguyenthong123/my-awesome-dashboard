import React, { useState, useMemo, useEffect } from 'react';
import useFetchData from '../hooks/useFetchData';
// KHÔNG cần import Header ở đây nữa
import { useAuth } from '../context/AuthContext';

const PRODUCTS_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/products.json';
const PRICES_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/prices.json';

// Danh sách các vai trò có quyền xem tất cả các loại giá
const ADVANCED_ROLES = ['Cửa Hàng', 'Nhà Máy Tôn', 'ad mind'];

function ProductsPage() {
  const { user } = useAuth();
  const { data: products, isLoading: isLoadingProducts } = useFetchData(PRODUCTS_URL);
  const { data: prices, isLoading: isLoadingPrices } = useFetchData(PRICES_URL);

  const [selectedPriceType, setSelectedPriceType] = useState('Giá chủ nhà');

  const availablePriceTypes = useMemo(() => {
    if (!prices) return [];
    
    const priceKeys = new Set();
    const excludedKeys = ['group_id', 'id_san_pham', 'Tên sản phẩm', 'kích thước', 'số kg trên tấm', 'số tấm /kiện', 'image sản phẩm'];

    prices.forEach(price => {
      Object.keys(price).forEach(key => {
        if (!excludedKeys.includes(key) && price[key]) {
          priceKeys.add(key);
        }
      });
    });
    
    return Array.from(priceKeys);
  }, [prices]);

  useEffect(() => {
    if (user?.phan_loai === 'Thầu Thợ') {
      setSelectedPriceType('Giá chủ nhà');
    } else if (ADVANCED_ROLES.includes(user?.phan_loai)) {
      const defaultPrice = availablePriceTypes.find(p => p.toLowerCase().includes('niêm yết')) || availablePriceTypes[0];
      setSelectedPriceType(defaultPrice);
    }
  }, [user, availablePriceTypes]);


  if (isLoadingProducts || isLoadingPrices) {
    return <div style={{ padding: '1rem' }}>Loading product details...</div>;
  }

  if (!products || !prices) {
    return <div style={{ padding: '1rem' }}>Could not load data.</div>;
  }

  const combinedData = Object.values(products).map(product => ({
    ...product,
    prices: prices.filter(price => price.group_id === product.id),
  }));

  // return đã được dọn dẹp, không còn Header
  return (
    <div style={{ padding: '1rem' }}>
      <h1>Bảng Giá Sản Phẩm</h1>
      <p>Hiển thị giá theo vai trò của bạn: <strong>{user?.phan_loai}</strong></p>

      {/* --- NÚT CHO VAI TRÒ "THẦU THỢ" --- */}
      {user?.phan_loai === 'Thầu Thợ' && (
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setSelectedPriceType('Giá chủ nhà')}
            style={{ fontWeight: selectedPriceType === 'Giá chủ nhà' ? 'bold' : 'normal' }}
          >
            Xem Giá Chủ nhà
          </button>
          <button 
            onClick={() => setSelectedPriceType('Giá Thầu Thợ')}
            style={{ fontWeight: selectedPriceType === 'Giá Thầu Thợ' ? 'bold' : 'normal' }}
          >
            Xem Giá Thầu Thợ
          </button>
        </div>
      )}

      {/* --- NÚT CHO CÁC VAI TRÒ CAO CẤP KHÁC --- */}
      {ADVANCED_ROLES.includes(user?.phan_loai) && (
        <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {availablePriceTypes.map(priceType => (
            <button
              key={priceType}
              onClick={() => setSelectedPriceType(priceType)}
              style={{ fontWeight: selectedPriceType === priceType ? 'bold' : 'normal' }}
            >
              {priceType}
            </button>
          ))}
        </div>
      )}

      {/* --- BẢNG GIÁ ĐỘNG --- */}
      <div>
        {combinedData.map(product => {
            const priceKey = selectedPriceType;
            return (
              <div key={product.id} style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem' }}>
                <h2>{product.name}</h2>
                {product.images && product.images.length > 0 &&
                  <img src={product.images[0]} alt={product.name} style={{ maxWidth: '200px', marginBottom: '1rem' }} />
                }
                
                <h4>Bảng giá chi tiết ({selectedPriceType}):</h4>
                
                {product.prices.length > 0 ? (
                  <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th>Tên chi tiết</th>
                        <th>Giá ({selectedPriceType})</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.prices.map(price => (
                          <tr key={price.id_san_pham}>
                            <td>{price["Tên sản phẩm"]}</td>
                            <td>
                              <strong>
                                {price[priceKey] ? `${price[priceKey].toLocaleString('vi-VN')} VNĐ` : 'N/A'}
                              </strong>
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Chưa có thông tin giá cho sản phẩm này. Vui lòng liên hệ.</p>
                )}
              </div>
            )
        })}
      </div>
    </div>
  );
}

export default ProductsPage;