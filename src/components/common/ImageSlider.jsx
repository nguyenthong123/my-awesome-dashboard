import React, { useState, useEffect } from 'react';
import './ImageSlider.css'; // <-- Import file CSS mới

function ImageSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return; // Không cần tự chuyển nếu chỉ có 1 ảnh

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [images]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    // Sử dụng className thay vì style
    <div className="slider-container">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Slide ${index}`}
          className="slider-slide"
          // Style động để xử lý hiệu ứng mờ
          style={{
            opacity: index === currentIndex ? 1 : 0,
          }}
        />
      ))}
    </div>
  );
}

export default ImageSlider;