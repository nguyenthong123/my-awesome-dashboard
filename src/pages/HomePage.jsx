import React from 'react';
import useFetchData from '../hooks/useFetchData';
// KHÔNG import Header nữa

// --- BƯỚC 1: IMPORT CÁC ẢNH TỪ THƯ MỤC ASSETS ---
import duraFlexImage from '../assets/images/tam-xi-mang-duraflex.png'; // Thay bằng tên file ảnh thật của bạn
import duraVisImage from '../assets/images/vit-chuyen-dung-duravis.png'; // Thay bằng tên file ảnh thật của bạn
import duraWoodImage from '../assets/images/tam-van-go-durawood.png'; // Thay bằng tên file ảnh thật của bạn

const PRODUCTS_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/products.json';
const PRICES_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/prices.json';

// --- BƯỚC 2: TẠO BẢN ĐỒ LIÊN KẾT ID SẢN PHẨM VÀ ẢNH ---
// Key ở đây phải khớp với `id` của sản phẩm trong file products.json
const productImageMap = {
  'tam-dura-low-carbon': duraFlexImage,
  'vit-chuyen-dung-dura-vis': duraVisImage,
  'tam-van-go-durawood': duraWoodImage,
  // Thêm các sản phẩm khác vào đây
};

function HomePage() {
  const { data: products, isLoading: isLoadingProducts } = useFetchData(PRODUCTS_URL);
  const { data: prices, isLoading: isLoadingPrices } = useFetchData(PRICES_URL);

  if (isLoadingProducts || isLoadingPrices) {
    return <div style={{ padding: '1rem' }}>Loading products...</div>;
  }

  if (!products || !prices) {
    return <div style={{ padding: '1rem' }}>Could not load product data.</div>;
  }

  const combinedData = Object.values(products).map(product => ({
    ...product,
    prices: prices.filter(price => price.group_id === product.id),
  }));

  const filterAndDisplayProducts = (productsList) => {
    return productsList.map(product => {
      const homeOwnerPrices = product.prices.filter(p => p["Giá chủ nhà"]);

      return (
        <div key={product.id} style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem' }}>
          <h2>{product.name}</h2>
          
          {/* --- BƯỚC 3: SỬ DỤNG BẢN ĐỒ ĐỂ LẤY ẢNH --- */}
          {productImageMap[product.id] ? (
            <img src={productImageMap[product.id]} alt={product.name} style={{ maxWidth: '200px' }} />
          ) : (
            // Hiển thị một ảnh mặc định nếu không tìm thấy ảnh cho sản phẩm
            <div style={{ width: '200px', height: '150px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Image</div>
          )}

          <h4>Giá cho Chủ nhà:</h4>
          {homeOwnerPrices.length > 0 ? (
            <ul>
              {homeOwnerPrices.map(price => (
                <li key={price.id_san_pham}>
                  {price["Tên sản phẩm"]}: <strong>{price["Giá chủ nhà"].toLocaleString('vi-VN')} VNĐ</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p>Vui lòng liên hệ để biết giá.</p>
          )}
        </div>
      );
    });
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Sản Phẩm Của Chúng Tôi</h1>
      <div>
        {filterAndDisplayProducts(combinedData)}
      </div>
    </div>
  );
}

export default HomePage;