import React, { useState, useMemo } from 'react';
import useFetchData from '../hooks/useFetchData';
import ImageSlider from '../components/common/ImageSlider';
import VideoSlider from '../components/common/VideoSlider';
import { videos } from '../config/videoData';
import FeaturedProducts from '../components/products/FeaturedProducts';
import './HomePage.css'; // <-- Import file CSS mới

// --- Import ảnh cho Slider chính ---
import sliderImage1 from '../assets/images/slider-1.jpg';
import sliderImage2 from '../assets/images/slider-2.jpg';
import sliderImage3 from '../assets/images/slider-3.jpg';

const sliderImages = [sliderImage1, sliderImage2, sliderImage3];

// --- URLs và Cấu hình ---
const PRODUCTS_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/products.json';
const PRICES_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/prices.json';

// --- CẤU HÌNH MỚI CHO VIỆC TÍNH VÍT ---
const SQUARE_METERS_PER_SHEET = 3;
const SCREWS_PER_SHEET = 20;
const SCREWS_PER_PACK = 300;
const PRICE_PER_SCREW_PACK = 150000;

// ==================================================================
// === COMPONENT CON: CÔNG CỤ TÍNH TOÁN (ĐÃ CẬP NHẬT GIAO DIỆN VÀ LOGIC)
// ==================================================================
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
    return prices.filter(p => p.group_id === selectedProductId);
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
    const m2 = parseFloat(squareMeters);
    const numberOfSheets = Math.ceil(m2 / SQUARE_METERS_PER_SHEET);
    const variantInfo = prices.find(p => p.id_san_pham === selectedPriceId);
    if (!variantInfo) return;

    const itemsToAdd = [];
    const mainItem = {
      id: variantInfo.id_san_pham,
      name: `${products[variantInfo.group_id].name} - ${variantInfo["Tên sản phẩm"]}`,
      quantity: numberOfSheets,
      unitPrice: variantInfo["Giá chủ nhà"],
      total: numberOfSheets * variantInfo["Giá chủ nhà"],
    };
    itemsToAdd.push(mainItem);

    if (products[variantInfo.group_id].type.includes('tam')) {
      const numberOfScrews = numberOfSheets * SCREWS_PER_SHEET;
      const screwProduct = calculableProducts.find(p => p.type === 'vit');
      if (screwProduct) {
        // *** LOGIC TÍNH GIÁ VÍT MỚI ***
        const pricePerScrew = PRICE_PER_SCREW_PACK / SCREWS_PER_PACK;
        const totalScrewPrice = Math.round(numberOfScrews * pricePerScrew); // Làm tròn tổng tiền vít
        const screwItem = {
          id: screwProduct.id + '_screws', // Tạo id duy nhất
          name: screwProduct.name,
          quantity: numberOfScrews,
          unitPrice: pricePerScrew, // Đơn giá là giá của 1 con vít
          total: totalScrewPrice,
        };
        itemsToAdd.push(screwItem);
      }
    }

    setDraftOrder(prevOrder => {
      let updatedOrder = [...prevOrder];
      itemsToAdd.forEach(newItem => {
        const existingItemIndex = updatedOrder.findIndex(item => item.id === newItem.id);
        if (existingItemIndex > -1) {
          updatedOrder[existingItemIndex].quantity += newItem.quantity;
          updatedOrder[existingItemIndex].total += newItem.total;
        } else {
          updatedOrder.push(newItem);
        }
      });
      return updatedOrder;
    });

    setSelectedProductId('');
    setSelectedPriceId('');
    setSquareMeters('');
  };

  const totalDraftPrice = draftOrder.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="calculator-container">
      <div className="calculator-box">
        <h1>Công cụ Ước tính Vật tư</h1>
        <p><strong>Hướng dẫn:</strong> Chỉ cần nhập số m² công trình, hệ thống sẽ tính số lượng vật tư. <br /> <i>Lưu ý: 1 tấm DURAfex ≈ 3m², 1 tấm cần khoảng 20 con vít.</i></p>

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
          <h2>Đơn hàng nháp</h2>
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th>Sản phẩm</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th></tr></thead>
            <tbody>
              {draftOrder.map(item => (<tr key={item.id}><td>{item.name}</td><td style={{ textAlign: 'right' }}>{item.unitPrice.toLocaleString('vi-VN')} VNĐ</td><td style={{ textAlign: 'center' }}>{item.quantity}</td><td style={{ textAlign: 'right' }}>{item.total.toLocaleString('vi-VN')} VNĐ</td></tr>))}
            </tbody>
            <tfoot><tr><td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>Tổng cộng:</td><td style={{ textAlign: 'right', fontWeight: 'bold' }}>{totalDraftPrice.toLocaleString('vi-VN')} VNĐ</td></tr></tfoot>
          </table>
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
    return <div style={{ padding: '1rem' }}>Loading page...</div>;
  }

  if (!products || !prices) {
    return <div style={{ padding: '1rem' }}>Could not load data.</div>;
  }

  return (
    <div>
      <ImageSlider images={sliderImages} />

      <div style={{ padding: '1rem' }}>
        <h1>Sản Phẩm Nổi Bật</h1>
        <FeaturedProducts prices={prices} />
        <DraftOrderCalculator products={products} prices={prices} />
        <VideoSlider videoList={videos} />
      </div>

      <footer style={{ padding: '2rem 1rem', marginTop: '2rem', borderTop: '1px solid #ccc', textAlign: 'center', color: '#666', backgroundColor: '#f8f9fa' }}>
        <p>© 2025 My Awesome Dashboard. All Rights Reserved.</p>
        <p>Thông tin liên hệ | Chính sách bảo mật</p>
      </footer>
    </div>
  );
}

export default HomePage;