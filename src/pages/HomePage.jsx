import React, { useState, useMemo } from 'react';
import useFetchData from '../hooks/useFetchData';
import ImageSlider from '../components/common/ImageSlider';
import VideoSlider from '../components/common/VideoSlider';
import { videos } from '../config/videoData';
import FeaturedProducts from '../components/products/FeaturedProducts';
import './HomePage.css';

// --- Import ảnh cho Slider chính ---
import sliderImage1 from '../assets/images/slider-1.jpg';
import sliderImage2 from '../assets/images/slider-2.jpg';
import sliderImage3 from '../assets/images/slider-3.jpg';

const sliderImages = [sliderImage1, sliderImage2, sliderImage3];

// --- URLs và Cấu hình ---
const PRODUCTS_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/products.json';
const PRICES_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/prices.json';



// ==================================================================
// === COMPONENT CON: CÔNG CỤ TÍNH TOÁN (ĐÃ KHÔI PHỤC ĐẦY ĐỦ)
// ==================================================================
// Trong file HomePage.jsx, tìm và thay thế toàn bộ function DraftOrderCalculator

function DraftOrderCalculator({ products, prices }) {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedPriceId, setSelectedPriceId] = useState('');
  const [squareMeters, setSquareMeters] = useState('');
  const [draftOrder, setDraftOrder] = useState([]);

  const calculableProducts = useMemo(() => {
    if (!products || !prices) return [];
    const priceGroupIds = new Set(prices.map(p => p.group_id));
    return Object.values(products).filter(p => priceGroupIds.has(p.id));
  }, [products, prices]);

  const selectedProductVariants = useMemo(() => {
    if (!selectedProductId || !prices) return [];
    return prices.filter(p => p.group_id === selectedProductId && p.width_mm && p.length_mm);
  }, [selectedProductId, prices]);
  
  const getCategoryFromThickness = (variantName) => {
    if (!variantName) return "Không xác định";
    const match = variantName.match(/\d+([,.]\d+)?/);
    if (!match) return "Không xác định";
    const thickness = parseFloat(match[0].replace(',', '.'));
    if (thickness <= 4.5) return 'Làm trần';
    if (thickness <= 9) return 'Làm vách trong nhà';
    if (thickness <= 12) return 'Làm vách ngoài trời và làm mái nhà';
    return 'Làm sàn';
  };

  const handleAddProductToDraft = () => {
    if (!selectedPriceId || !squareMeters || parseFloat(squareMeters) <= 0) {
      alert("Vui lòng chọn sản phẩm, độ dày và nhập số mét vuông hợp lệ.");
      return;
    }
    const variantInfo = prices.find(p => p.id_san_pham === selectedPriceId);
    if (!variantInfo) return;

    if (!variantInfo.width_mm || !variantInfo.length_mm) {
      alert("Sản phẩm này chưa có thông tin kích thước để tính toán.");
      return;
    }
    const areaPerSheet = (variantInfo.width_mm / 1000) * (variantInfo.length_mm / 1000);
    if (areaPerSheet <= 0) {
      alert("Kích thước sản phẩm không hợp lệ.");
      return;
    }

    const m2 = parseFloat(squareMeters);
    
    // --- LOGIC TÍNH SỐ TẤM CHÍNH XÁC HƠN ---
    const rawSheets = m2 / areaPerSheet; // Kết quả thô, có thể là 10.000000001
    let numberOfSheets;

    // So sánh kết quả thô với kết quả đã làm tròn (ví dụ 10)
    // Nếu sự chênh lệch là cực kỳ nhỏ, coi như là phép chia hết
    if (Math.abs(rawSheets - Math.round(rawSheets)) < 0.00001) {
      numberOfSheets = Math.round(rawSheets); // Lấy số nguyên (10)
    } else {
      numberOfSheets = Math.ceil(rawSheets); // Ngược lại, làm tròn lên (10.25 -> 11)
    }
    
    const mainItem = {
      id: variantInfo.id_san_pham,
      name: `${products[variantInfo.group_id].name} - ${variantInfo["Tên sản phẩm"]}`,
      quantity: numberOfSheets,
      unitPrice: variantInfo["Giá chủ nhà"],
      total: numberOfSheets * variantInfo["Giá chủ nhà"],
    };
    
    setDraftOrder(prevOrder => {
      let updatedOrder = [...prevOrder];
      const existingItemIndex = updatedOrder.findIndex(item => item.id === mainItem.id);
      if (existingItemIndex > -1) {
        updatedOrder[existingItemIndex].quantity += mainItem.quantity;
        updatedOrder[existingItemIndex].total += mainItem.total;
      } else {
        updatedOrder.push(mainItem);
      }
      return updatedOrder;
    });

    setSelectedProductId('');
    setSelectedPriceId('');
    setSquareMeters('');
  };

  const totalDraftPrice = draftOrder.reduce((sum, item) => sum + item.total, 0);

  // --- HÀM MỚI ĐỂ XÓA ĐƠN HÀNG NHÁP ---
  const handleClearDraft = () => {
    setDraftOrder([]);
  };

  return (
    <div className="calculator-container">
      <div className="calculator-box">
        <h1>Công cụ Ước tính Vật tư</h1>
        <p><strong>Hướng dẫn:</strong> Chỉ cần nhập số m² công trình, hệ thống sẽ tính số lượng vật tư. <br /> <i>Lưu ý: nên dựa theo kích thước để tính ra số m2 ví dụ 1 tấm duraflex khổ tiêu chuẩn (1.22m x 2.44m) có diện tích là 2.9768 m² (lấy 1220 x 2440)  .</i></p>
        <div className="calculator-form">
          <h3>Bước 1: Chọn sản phẩm và Nhập diện tích</h3>
          <select value={selectedProductId} onChange={e => { setSelectedProductId(e.target.value); setSelectedPriceId(''); }}>
            <option value="">-- Chọn Dòng Sản Phẩm --</option>
            {calculableProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {selectedProductId && (
            <select value={selectedPriceId} onChange={e => setSelectedPriceId(e.target.value)}>
              <option value="">-- Chọn Độ Dày / Quy Cách --</option>
              {selectedProductVariants.map(v => (
                <option key={v.id_san_pham} value={v.id_san_pham}>
                  {v["Tên sản phẩm"]} ({getCategoryFromThickness(v["Tên sản phẩm"])})
                </option>
              ))}
            </select>
          )}
          <input type="number" placeholder="Nhập số mét vuông (m²)" value={squareMeters} onChange={e => setSquareMeters(e.target.value)} min="1"/>
          <button onClick={handleAddProductToDraft}>Thêm vào Đơn hàng nháp</button>
        </div>
      </div>

       {draftOrder.length > 0 && (
        <div style={{ marginTop: '2rem', maxWidth: '800px', margin: '2rem auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Đơn hàng nháp</h2>
            <button 
              onClick={handleClearDraft} 
              style={{ backgroundColor: '#dc3545', borderColor: '#dc3545', fontSize: '0.9rem' }}
            >
              Xóa đơn nháp
            </button>
          </div>
          
          <div className="table-container">
            {/* --- CẬP NHẬT BẢNG TẠI ĐÂY --- */}
            <table className="product-price-table" style={{ minWidth: '600px' }}>
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Sản phẩm</th>
                  <th className="text-right" style={{ width: '20%' }}>Đơn giá</th>
                  <th className="text-center" style={{ width: '15%' }}>Số lượng</th>
                  <th className="text-right" style={{ width: '25%' }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {draftOrder.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td className="text-right">{item.unitPrice.toLocaleString('vi-VN')} VNĐ</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">{item.total.toLocaleString('vi-VN')} VNĐ</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-right" style={{ fontWeight: 'bold' }}>Tổng cộng:</td>
                  <td className="text-right" style={{ fontWeight: 'bold' }}>{totalDraftPrice.toLocaleString('vi-VN')} VNĐ</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ===============================================
// === COMPONENT CHÍNH: HOMEPAGE
// ===============================================
function HomePage() {
  const { data: products, isLoading: isLoadingProducts } = useFetchData(PRODUCTS_URL);
  const { data: prices, isLoading: isLoadingPrices } = useFetchData(PRICES_URL);

  if (isLoadingProducts || isLoadingPrices) {
    return <div className="page-container">Loading page...</div>;
  }
  if (!products || !prices) {
    return <div className="page-container">Could not load data.</div>;
  }

  return (
    <div>
      <ImageSlider images={sliderImages} />
      <div className="page-container">
        <h1>Sản Phẩm Nổi Bật</h1>
        <FeaturedProducts prices={prices} />
        <DraftOrderCalculator products={products} prices={prices} />
        <VideoSlider videoList={videos} />
      </div>
      <footer className="footer">
        <p>© 2025 My Awesome Dashboard. All Rights Reserved.</p>
        <p>Thông tin liên hệ | Chính sách bảo mật</p>
      </footer>
    </div>
  );
}

export default HomePage;