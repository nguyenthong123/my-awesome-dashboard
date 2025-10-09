import React, { useState, useMemo, useEffect } from 'react'; // <-- Thêm useMemo và useEffect
import useFetchData from '../hooks/useFetchData';
import Header from '../components/layout/Header';
import { useAuth } from '../context/AuthContext';

const PRODUCTS_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/products.json';
const PRICES_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/prices.json';

// Danh sách các vai trò có quyền xem tất cả các loại giá
const ADVANCED_ROLES = ['Cửa Hàng', 'Nhà Máy Tôn', 'ad mind'];

function ProductsPage() {
  const { user } = useAuth();
  const { data: products, isLoading: isLoadingProducts } = useFetchData(PRODUCTS_URL);
  const { data: prices, isLoading: isLoadingPrices } = useFetchData(PRICES_URL);

  // State để quản lý loại giá đang được chọn. Tên của state chính là key trong file JSON
  const [selectedPriceType, setSelectedPriceType] = useState('Giá chủ nhà'); 

  // --- LOGIC MỚI: TỰ ĐỘNG LẤY CÁC LOẠI GIÁ ---
  // useMemo giúp tối ưu hiệu suất, chỉ tính toán lại khi `prices` thay đổi
  const availablePriceTypes = useMemo(() => {
    if (!prices) return [];
    
    const priceKeys = new Set();
    const excludedKeys = ['group_id', 'id_san_pham', 'Tên sản phẩm', 'kích thước', 'số kg trên tấm', 'số tấm /kiện', 'image sản phẩm'];

    prices.forEach(price => {
      Object.keys(price).forEach(key => {
        // Chỉ thêm vào nếu key không nằm trong danh sách loại trừ và có giá trị
        if (!excludedKeys.includes(key) && price[key]) {
          priceKeys.add(key);
        }
      });
    });
    
    return Array.from(priceKeys); // Trả về mảng các loại giá duy nhất, ví dụ: ["Giá Thầu Thợ", "gói 1 kiện", ...]
  }, [prices]);

  // Thiết lập giá trị mặc định cho state khi dữ liệu được tải xong
  useEffect(() => {
    if (user?.phan_loai === 'Thầu Thợ') {
      setSelectedPriceType('Giá chủ nhà');
    } else if (ADVANCED_ROLES.includes(user?.phan_loai)) {
      // Mặc định cho các vai trò khác là giá niêm yết, nếu không có thì lấy giá đầu tiên
      const defaultPrice = availablePriceTypes.find(p => p.toLowerCase().includes('niêm yết')) || availablePriceTypes[0];
      setSelectedPriceType(defaultPrice);
    }
  }, [user, availablePriceTypes]);


  if (isLoadingProducts || isLoadingPrices) {
    return <div>Loading product details...</div>;
  }

  if (!products || !prices) {
    return <div>Could not load data.</div>;
  }

  const combinedData = Object.values(products).map(product => ({
    ...product,
    prices: prices.filter(price => price.group_id === product.id),
  }));

  // --- PHẦN GIAO DIỆN ĐƯỢC CẬP NHẬT ---
  return (
    <div>
      <Header />
      <main style={{ padding: '1rem' }}>
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
          {combinedData.map(product => (
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
                                {price[selectedPriceType] ? `${price[selectedPriceType].toLocaleString('vi-VN')} VNĐ` : 'N/A'}
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
          ))}
        </div>
      </main>
    </div>
  );
}

export default ProductsPage;