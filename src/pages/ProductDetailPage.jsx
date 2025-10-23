import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import useFetchData from '../hooks/useFetchData';
import { getProductImage } from '../utils/imageLoader';
import Breadcrumbs from '../components/common/Breadcrumbs';
import WarrantySection from '../components/products/WarrantySection';
import { warrantyDetails } from '../config/warrantyData';
import './ProductDetailPage.css';

const PRICES_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/prices.json';
const PRODUCTS_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/products.json';

function ProductDetailPage() {
  const { slug } = useParams();
  const { data: prices, isLoading: isLoadingPrices } = useFetchData(PRICES_URL);
  const { data: products, isLoading: isLoadingProducts } = useFetchData(PRODUCTS_URL);
  const [mainImage, setMainImage] = useState(null);

  const productVariant = useMemo(() => {
    if (!prices) return null;
    return prices.find(p => p.product_slug === slug);
  }, [prices, slug]);

  const images = useMemo(() => {
    if (!productVariant || !productVariant["image sản phẩm"]) return [];
    return String(productVariant["image sản phẩm"])
      .split(',')
      .map(name => name.trim())
      .filter(Boolean)
      .map(name => getProductImage(name))
      .filter(Boolean);
  }, [productVariant]);

  useEffect(() => {
    if (images.length > 0) {
      setMainImage(images[0]);
    }
  }, [images]);

  if (isLoadingPrices || isLoadingProducts) {
    return <div className="page-container" style={{ textAlign: 'center', padding: '4rem 0' }}>Đang tải thông tin sản phẩm...</div>;
  }

  if (!productVariant) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1 style={{ fontSize: '6rem', margin: 0, color: 'var(--primary-green)' }}>404</h1>
        <h2>Sản phẩm không tồn tại</h2>
        <p>Rất tiếc, chúng tôi không tìm thấy sản phẩm bạn yêu cầu.</p>
        <Link to="/" style={{ display: 'inline-block', marginTop: '1.5rem', padding: '10px 20px', backgroundColor: 'var(--primary-blue)', color: 'white', textDecoration: 'none', borderRadius: '6px' }}>
          Quay về Trang chủ
        </Link>
      </div>
    );
  }

  const productGroup = products ? products[productVariant.group_id] : null;
  const warrantyId = productVariant.warranty_id; 
  const selectedWarrantyData = warrantyId ? warrantyDetails[warrantyId] : null;

  const breadcrumbCrumbs = [
    { label: 'Trang chủ', link: '/' },
    ...(productGroup ? [{ label: productGroup.category, link: `/category/${productGroup.category.toLowerCase().replace(/ /g, '-')}` }] : []),
    { label: productVariant["Tên sản phẩm"], link: `/san-pham/${slug}` }
  ];

  return (
    // Sử dụng Fragment để <WarrantySection> có thể là một section full-width riêng
    <>
      <div className="page-container">
        <Breadcrumbs crumbs={breadcrumbCrumbs} />
        <div className="product-detail-container">
          <div className="product-gallery">
            <div className="product-detail-image-wrapper">
              {mainImage ? (
                <img src={mainImage} alt={productVariant["Tên sản phẩm"]} className="product-detail-image" />
              ) : (
                <div>Loading image...</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="thumbnail-container">
                {images.map((imgSrc, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail-item ${imgSrc === mainImage ? 'active' : ''}`}
                    onClick={() => setMainImage(imgSrc)}
                  >
                    <img src={imgSrc} alt={`Thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="product-detail-info">
            {productGroup && <p style={{ color: 'var(--text-secondary-color)' }}>{productGroup.category}</p>}
            <h1>{productVariant["Tên sản phẩm"]}</h1>
            <div className="product-detail-price">
              {productVariant["Giá chủ nhà"]?.toLocaleString('vi-VN')} VNĐ
            </div>
            <p>{productVariant.long_description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}</p>
            
            <h3 style={{ marginTop: '2.5rem' }}>Thông số kỹ thuật</h3>
            <table className="product-specs-table">
              <tbody>
                <tr><td>Kích thước</td><td>{productVariant["kích thước"]}</td></tr>
                <tr><td>Số kg / tấm</td><td>{productVariant["số kg trên tấm"]}</td></tr>
                <tr><td>Số tấm / kiện</td><td>{productVariant["số tấm /kiện"]}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {productVariant.youtube_id && (
          <div style={{marginTop: '4rem'}}>
            <h2 style={{ textAlign: 'center' }}>Video Hướng dẫn Thi công</h2>
            <div className="video-wrapper" style={{ maxWidth: '800px', margin: '2rem auto', borderRadius: '12px' }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '12px' }}
                src={`https://www.youtube.com/embed/${productVariant.youtube_id}`}
                title={`Video for ${productVariant["Tên sản phẩm"]}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>

      {/* --- ĐẶT COMPONENT BẢO HÀNH Ở ĐÚNG VỊ TRÍ --- */}
      {selectedWarrantyData && (
        <WarrantySection 
          warrantyData={selectedWarrantyData}
          productList={prices.filter(p => p.group_id === productVariant.group_id)}
        />
      )}
    </>
  );
}

export default ProductDetailPage;