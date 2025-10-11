// src/components/common/ImageSlider.jsx
import React, { useState, useEffect } from 'react';

const sliderContainerStyle = {
  width: '100%',
  height: '300px', // Bạn có thể điều chỉnh chiều cao
  position: 'relative',
  overflow: 'hidden',
  marginBottom: '2rem',
};

const slideStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover', // Đảm bảo ảnh lấp đầy khung mà không bị méo
  position: 'absolute',
  transition: 'opacity 1s ease-in-out', // Hiệu ứng mờ dần
};

function ImageSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;

    // Thiết lập một interval để chuyển slide sau mỗi 3 giây
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // 3000ms = 3 giây

    // Dọn dẹp interval khi component bị unmount
    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) {
    return null; // Không hiển thị gì nếu không có ảnh
  }

  return (
    <div style={sliderContainerStyle}>
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Slide ${index}`}
          style={{
            ...slideStyle,
            opacity: index === currentIndex ? 1 : 0, // Chỉ hiển thị slide hiện tại
          }}
        />
      ))}
    </div>
  );
}

export default ImageSlider;