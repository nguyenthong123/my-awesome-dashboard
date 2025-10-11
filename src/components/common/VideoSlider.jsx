import React, { useState } from 'react';
import './VideoSlider.css'; // <-- Import file CSS mới

function VideoSlider({ videoList }) {
  // State để lưu video đang được chọn. Mặc định là video đầu tiên trong danh sách.
  const [selectedVideo, setSelectedVideo] = useState(videoList[0]);

  if (!videoList || videoList.length === 0) {
    return null;
  }

  return (
    // Sử dụng className thay vì style
    <div className="video-slider-container">
      <h2>Video Hướng dẫn Thi công</h2>
      
      {/* Danh sách các icon */}
      <div className="icon-container">
        {videoList.map(video => (
          <div 
            key={video.id} 
            className="icon-wrapper"
            // Giữ lại style động này để thêm hiệu ứng gạch chân khi được chọn
            style={{
              borderBottom: selectedVideo.id === video.id ? '3px solid #007bff' : '3px solid transparent'
            }} 
            onClick={() => setSelectedVideo(video)}
          >
            <img src={video.icon} alt={video.title} className="icon-image" />
            <p className="icon-title">{video.title}</p>
          </div>
        ))}
      </div>

      {/* Khung hiển thị video */}
      {selectedVideo && (
        <div className="video-wrapper">
          <iframe
            className="video-iframe"
            src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
            title={selectedVideo.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
}

export default VideoSlider;