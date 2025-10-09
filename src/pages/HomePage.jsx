import React from 'react';
import useFetchData from '../hooks/useFetchData';
import Header from '../components/layout/Header'; // Ta vẫn dùng Header chung

// URLs đến các file dữ liệu mới
const PRODUCTS_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/products.json';
const PRICES_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/prices.json';

function HomePage() {
  // Gọi API để lấy danh sách sản phẩm
  const { data: products, isLoading: isLoadingProducts } = useFetchData(PRODUCTS_URL);
  // Gọi API để lấy bảng giá
  const { data: prices, isLoading: isLoadingPrices } = useFetchData(PRICES_URL);

  // Xử lý khi dữ liệu đang tải
  if (isLoadingProducts || isLoadingPrices) {
    return <div>Loading products...</div>;
  }

  // Xử lý khi chưa có dữ liệu (lỗi hoặc chưa tải xong)
  if (!products || !prices) {
    return <div>Could not load product data. Please try again later.</div>;
  }

  // Logic kết hợp dữ liệu sản phẩm và giá
  const combinedData = Object.values(products).map(product => {
    // Tìm tất cả các loại giá cho sản phẩm này
    const productPrices = prices.filter(price => price.group_id === product.id);
    return {
      ...product,
      prices: productPrices, // Thêm mảng giá vào thông tin sản phẩm
    };
  });

  // Lọc ra giá "Giá Chủ nhà" để hiển thị
  const filterAndDisplayProducts = (productsList) => {
    return productsList.map(product => (
      <div key={product.id} style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem' }}>
        <h2>{product.name}</h2>
        <img src={product.images[0]} alt={product.name} style={{ width: '200px' }} />
        <h4>Giá cho Chủ nhà:</h4>
        <ul>
          {product.prices
            .filter(p => p["Giá chủ nhà"]) // Chỉ lấy các mục có "Giá Chủ nhà"
            .map(price => (
              <li key={price.id_san_pham}>
                {price["Tên sản phẩm"]}: <strong>{price["Giá chủ nhà"].toLocaleString('vi-VN')} VNĐ</strong>
              </li>
            ))}
        </ul>
      </div>
    ));
  };

  return (
    <div>
      <Header />
      <main style={{ padding: '1rem' }}>
        <h1>Sản Phẩm Của Chúng Tôi</h1>
        <div>
          {filterAndDisplayProducts(combinedData)}
        </div>
      </main>
    </div>
  );
}

export default HomePage;