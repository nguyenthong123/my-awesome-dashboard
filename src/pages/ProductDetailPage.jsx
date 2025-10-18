import React from 'react';
import { useParams, Link } from 'react-router-dom';
import useFetchData from '../hooks/useFetchData';
import { getProductImage } from '../utils/imageLoader';
import './ProductDetailPage.css';

const PRICES_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/prices.json';
const PRODUCTS_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/products.json';

function ProductDetailPage() {
  const { slug } = useParams();
  const { data: prices, isLoading: isLoadingPrices } = useFetchData(PRICES_URL);
  const { data: products, isLoading: isLoadingProducts } = useFetchData(PRODUCTS_URL);

  if (isLoadingPrices || isLoadingProducts) {
    return <div className="page-container" style={{ textAlign: 'center', padding: '4rem 0' }}>Đang tải thông tin sản phẩm...</div>;
  }

  if (!prices || !products) {
    return <div className="page-container" style={{ textAlign: 'center', padding: '4rem 0' }}>Không thể tải dữ liệu sản phẩm.</div>;
  }
  
  const productVariant = prices.find(p => p.product_slug === slug);

  if (!productVariant) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1 style={{ fontSize: '6rem', margin: 0, color: 'var(--primary-green)' }}>404</h1>
        <h2>Sản phẩm không tồn tại</h2>
        <p>Rất tiếc, chúng tôi không tìm thấy sản phẩm bạn yêu cầu. Có thể đường dẫn đã bị thay đổi hoặc sản phẩm không còn tồn tại.</p>
        <Link to="/" style={{ display: 'inline-block', marginTop: '1.5rem', padding: '10px 20px', backgroundColor: 'var(--primary-blue)', color: 'white', textDecoration: 'none', borderRadius: '6px' }}>
          Quay về Trang chủ
        </Link>
      </div>
    );
  }

  const productGroup = products[productVariant.group_id];
  const imageSrc = getProductImage(productVariant["image sản phẩm"]);

  return (
    <div className="page-container">
      <div className="product-detail-container">
        <div className="product-detail-image-wrapper">
          <img src={imageSrc} alt={productVariant["Tên sản phẩm"]} className="product-detail-image" />
        </div>
        
        <div className="product-detail-info">
          {productGroup && <p style={{ color: 'var(--text-secondary-color)' }}>{productGroup.category}</p>}
          <h1>{productVariant["Tên sản phẩm"]}</h1>
          <div className="product-detail-price">
            {productVariant["Giá chủ nhà"]?.toLocaleString('vi-VN')} VNĐ
          </div>
          <p>Đây là khu vực mô tả ngắn về sản phẩm, nêu bật các ưu điểm chính và ứng dụng của nó.</p>
          
          <h3 style={{ marginTop: '2.5rem' }}>Thông số kỹ thuật</h3>
          <table className="product-specs-table">
            <tbody>
              <tr><td>Kích thước</td><td>{productVariant["kích thước"]}</td></tr>
              <tr><td>Số kg / tấm</td><td>{productVariant["số kg trên tấm"]}</td></tr>
              <tr><td>Số tấm / kiện</td><td>{productVariant["số tấm /kiện"]}</td></tr>
              {/* Thêm các hàng thông số khác nếu cần */}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Khu vực video có thể thêm ở đây */}
      {/* <div style={{marginTop: '4rem'}}>
        <h2>Video hướng dẫn</h2>
        // Logic hiển thị video
      </div> */}
    </div>
  );
}

export default ProductDetailPage;