import React, { useState, useMemo, useEffect } from 'react';
import Select from 'react-select';
import useFetchData from '../hooks/useFetchData';
import { useAuth } from '../context/AuthContext';
import './ProductsPage.css';
import TabSlider from '../components/products/TabSlider';
import duraflexLogo from '../assets/images/duraflex-logo.png';
import { getProductImage } from '../utils/imageLoader';

const PRODUCTS_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/products.json';
const PRICES_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/prices.json';
const ADVANCED_ROLES = ['Cửa Hàng', 'Nhà Máy Tôn', 'ad mind'];
const SPECIAL_PRICE_TYPES = ['giá niêm yết', 'Giá Thầu Thợ', 'Giá chủ nhà'];

// Style tùy chỉnh cho react-select
const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: 'var(--background-color)',
    borderColor: 'var(--border-color)',
    minHeight: '42px',
    color: 'var(--text-color)',
  }),
  valueContainer: (provided) => ({ ...provided, padding: '0 8px' }),
  input: (provided) => ({ ...provided, color: 'var(--text-color)' }),
  multiValue: (provided) => ({ ...provided, backgroundColor: '#e9ecef' }),
  multiValueLabel: (provided) => ({ ...provided, color: '#495057' }),
  menu: (provided) => ({ ...provided, backgroundColor: 'var(--card-background)', zIndex: 5 }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'var(--primary-green)' : state.isFocused ? 'var(--background-color)' : 'transparent',
    color: state.isSelected ? 'white' : 'var(--text-color)',
  }),
  placeholder: (provided) => ({ ...provided, color: 'var(--text-secondary-color)' }),
  singleValue: (provided) => ({ ...provided, color: 'var(--text-color)' }),
};


function ProductsPage() {
  const { user } = useAuth();
  const { data: products, isLoading: isLoadingProducts } = useFetchData(PRODUCTS_URL);
  const { data: prices, isLoading: isLoadingPrices } = useFetchData(PRICES_URL);
  
  const [selectedPriceType, setSelectedPriceType] = useState('giá niêm yết');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const availablePriceTypes = useMemo(() => {
    if (!prices) return [];
    const priceKeys = new Set();
    const excludedKeys = ['group_id', 'id_san_pham', 'Tên sản phẩm', 'kích thước', 'số kg trên tấm', 'số tấm /kiện', 'image sản phẩm', 'width_mm', 'length_mm', 'product_slug', 'long_description', 'youtube_id'];
    prices.forEach(price => {
      Object.keys(price).forEach(key => {
        if (!excludedKeys.includes(key) && price[key] !== "" && price[key] !== null && price[key] !== 0) {
          priceKeys.add(key);
        }
      });
    });
    return Array.from(priceKeys).sort();
  }, [prices]);

  useEffect(() => {
    if (!availablePriceTypes.length) return;
    if (user?.phan_loai === 'Thầu Thợ') {
      setSelectedPriceType('Giá chủ nhà');
    } else if (ADVANCED_ROLES.includes(user?.phan_loai)) {
      const defaultPrice = availablePriceTypes.find(p => p === 'giá niêm yết') || availablePriceTypes[0];
      setSelectedPriceType(defaultPrice);
    }
  }, [user, availablePriceTypes]);

  const groupOptions = useMemo(() => {
    if (!products) return [];
    return Object.values(products).map(p => ({ value: p.name, label: p.name }));
  }, [products]);

  const filteredAndGroupedData = useMemo(() => {
    if (!products || !prices) return [];
    let currentPrices = [...prices];
    if (searchTerm) {
      currentPrices = currentPrices.filter(p => p["Tên sản phẩm"] && p["Tên sản phẩm"].toLowerCase().includes(searchTerm.toLowerCase()));
    }
    currentPrices = currentPrices.filter(p => p[selectedPriceType]);
    const grouped = currentPrices.reduce((acc, variant) => {
      const groupInfo = products[variant.group_id];
      if (!groupInfo) return acc;
      acc[groupInfo.name] = acc[groupInfo.name] || { ...groupInfo, variants: [] };
      acc[groupInfo.name].variants.push(variant);
      return acc;
    }, {});
    
    let result = Object.values(grouped);
    if (selectedGroups.length > 0) {
      const selectedGroupNames = selectedGroups.map(g => g.value);
      result = result.filter(group => selectedGroupNames.includes(group.name));
    }
    return result;
  }, [products, prices, selectedPriceType, selectedGroups, searchTerm]);

  if (isLoadingProducts || isLoadingPrices) {
    return <div className="page-container">Loading product details...</div>;
  }
  
  const shouldShowNotes = SPECIAL_PRICE_TYPES.includes(selectedPriceType);

  return (
    <>
      <div className="page-container">
        <h1>Bảng Giá Sản Phẩm</h1>
        <p>Hiển thị giá theo vai trò của bạn: <strong>{user?.phan_loai}</strong></p>

        <div className="price-filters">
          <div className="filter-group">
            <label>Lọc theo Nhóm sản phẩm:</label>
            <Select
              isMulti
              options={groupOptions}
              value={selectedGroups}
              onChange={setSelectedGroups}
              placeholder="Chọn một hoặc nhiều nhóm..."
              styles={customSelectStyles} 
            />
          </div>
          <div className="filter-group">
            <label>Tìm kiếm Tên sản phẩm:</label>
            <input 
              type="text" 
              placeholder="Nhập tên sản phẩm, độ dày..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

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

        {filteredAndGroupedData.length > 0 ? (
          filteredAndGroupedData.map(product => (
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
                      // *** LOGIC LẤY ẢNH ĐẦU TIÊN ĐÃ ĐƯỢC THÊM VÀO ĐÂY ***
                      const imageFileNamesString = variant["image sản phẩm"] || '';
                      const firstImageName = imageFileNamesString.split(',')[0].trim();
                      const imageSrc = getProductImage(firstImageName);

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
                            {variant[selectedPriceType]?.toLocaleString('vi-VN') || ''} VNĐ
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <div style={{ marginTop: '3rem', textAlign: 'center', color: 'var(--text-secondary-color)' }}>
            <p>Không có sản phẩm nào phù hợp với bộ lọc hiện tại.</p>
          </div>
        )}

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