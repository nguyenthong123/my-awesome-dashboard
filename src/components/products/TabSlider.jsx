import React, { useState } from 'react';
import './TabSlider.css';

// --- ĐƯỜNG DẪN IMPORT ĐÃ ĐƯỢC SỬA LẠI (BỎ /certs) ---
import cert1Img from '../../assets/images/cert-1.png';
import cert2Img from '../../assets/images/cert-2.png';
import cert3Img from '../../assets/images/cert-3.png';
import cert4Img from '../../assets/images/cert-4.png';
import cert5Img from '../../assets/images/cert-5.png';
import cert6Img from '../../assets/images/cert-6.png';

// --- Dữ liệu cho component ---
const sliderData = [
  { 
    id: 'khong-amiang', 
    title: 'Không chứa Amiăng',
    image: cert1Img, 
    fullTitle: 'Xác nhận vật liệu Duraflex không chứa amiăng',
    description: 'Báo cáo có liệt kê tất cả 6 loại sợi amiăng phổ biến và kết quả cho thấy "Không phát hiện" (-). Do đó, chứng chỉ này xác nhận vật liệu Duraflex không chứa amiăng tại thời điểm thử nghiệm.',
    downloadLink: '/certs/cert-1.pdf', 
  },
  { 
    id: 'nhan-xanh', 
    title: 'Nhãn Xanh Singapore', 
    image: cert2Img, 
    fullTitle: 'Ghi nhãn Xanh Singapore',
    description: 'Chứng chỉ này là bằng chứng cho việc sản phẩm được kiểm tra để đáp ứng các tiêu chuẩn về Môi trường Xanh của Singapore, đảm bảo sản phẩm có hàm lượng chất hữu cơ dễ bay hơi (VOCs) thấp.',
    downloadLink: '/certs/cert-2.pdf',
  },
  { 
    id: 'dan-nhiet', 
    title: 'Dẫn nhiệt', 
    image: cert3Img, 
    fullTitle: 'Báo cáo Thử nghiệm Dẫn nhiệt',
    description: 'Đây là Báo cáo Thử nghiệm Dẫn nhiệt của tấm Duraflex Calcium Silicate, xác định khả năng cách nhiệt (hay dẫn nhiệt) của vật liệu theo tiêu chuẩn quốc tế ASTM C518.',
    downloadLink: '/certs/cert-3.pdf',
  },
  { 
    id: 'chong-chay', 
    title: 'Chống cháy', 
    image: cert4Img, 
    fullTitle: 'Khả năng Chống Cháy',
    description: 'Vật liệu thử nghiệm thuộc nhóm không cháy theo QCVN 06:2010/BXD và đạt tiêu chuẩn EN 13501-1:2007 (nhóm A1), là phân loại cao nhất về an toàn cháy.',
    downloadLink: '/certs/cert-4.pdf',
  },
  { 
    id: 'hop-chuan', 
    title: 'Hợp chuẩn', 
    image: cert5Img, 
    fullTitle: 'GIẤY CHỨNG NHẬN HỢP CHUẨN',
    description: 'Đây là Giấy Chứng nhận Hợp chuẩn do Viện Vật liệu Xây dựng cấp, xác nhận Tấm Xi măng Sợi của Công ty Hiệp Phú đạt tiêu chuẩn kỹ thuật quốc tế ASTM C1186.',
    downloadLink: '/certs/cert-5.pdf',
  },
  { 
    id: 'co-ly', 
    title: 'Cơ lý & Độ bền', 
    image: cert6Img, 
    fullTitle: 'Phiếu Kết quả Thử nghiệm Cơ Lý và Độ bền',
    description: 'Đây là Phiếu Kết quả Thử nghiệm do QUATEST 3 cấp, xác nhận tấm Duraflex đã được kiểm tra và đạt các yêu cầu về cường độ và mật độ theo tiêu chuẩn quốc tế ASTM C 1186.',
    downloadLink: '/certs/cert-6.pdf',
  },
];

// Component JSX giữ nguyên không đổi
function TabSlider() {
  const [activeTab, setActiveTab] = useState(sliderData[0]);

  return (
    <section className="tab-slider-section">
      <div className="page-container">
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '2rem' }}>Chứng nhận chất lượng</h2>
        <nav className="tab-slider-nav">
          {sliderData.map(tab => (
            <button key={tab.id} className={`tab-button ${activeTab.id === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              <span>{tab.title}</span>
            </button>
          ))}
        </nav>
        <div className="tab-slider-content">
          <div className="tab-slider-text">
            <h2>{activeTab.fullTitle}</h2>
            <p>{activeTab.description}</p>
            <a href={activeTab.downloadLink} download className="download-button">Tải về</a>
          </div>
          <div className="tab-slider-image">
            <img src={activeTab.image} alt={activeTab.title} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default TabSlider;