# Hướng Dẫn Thi Công - Tính Năng Mới

## 📋 Tổng Quan

Tính năng "Hướng Dẫn Thi Công" đã được thêm vào trang chi tiết sản phẩm. Nó sẽ hiển thị ngay trước phần "Bảo Hành" và sau phần video YouTube, cho phép khách hàng xem các bước thi công chi tiết cho từng sản phẩm.

## 🎯 Thành Phần Chính

### 1. GuideSection Component (`src/components/products/GuideSection.jsx`)
- Component React hiển thị hướng dẫn thi công dưới dạng các bước có thể mở rộng/thu gọn
- Mỗi bước có:
  - Số bước (badge tròn với số)
  - Hình ảnh minh họa (nếu có)
  - Mô tả chi tiết của bước
  - Toggle để mở/đóng chi tiết

### 2. Stylesheet (`src/components/products/GuideSection.css`)
- CSS hiện đại với animation
- Hỗ trợ dark mode
- Responsive cho mobile (768px, 480px)
- Gradient banner cho tiêu đề

### 3. Config File (`src/config/guidesData.js`)
- Ánh xạ tên sản phẩm → Guide ID
- Dễ dàng thêm sản phẩm mới hoặc hướng dẫn mới
- Cấu trúc dễ bảo trì

### 4. ProductDetailPage (`src/pages/ProductDetailPage.jsx`)
- Fetch dữ liệu guides từ GitHub
- Tự động tìm guide phù hợp dựa trên tên sản phẩm
- Hiển thị GuideSection trước WarrantySection

## 🚀 Cách Sử Dụng

### Thêm Hướng Dẫn Cho Sản Phẩm Mới

#### Bước 1: Thêm dữ liệu vào `guides.json` trên GitHub
```json
{
  "duraflex_vach_trong_guide": [
    {
      "step_number": 1,
      "image_url": "khung_sat_hop.jpg",
      "description": "Mô tả chi tiết bước 1..."
    },
    {
      "step_number": 2,
      "image_url": "lap_tam.jpg",
      "description": "Mô tả chi tiết bước 2..."
    }
  ]
}
```

#### Bước 2: Cập nhật `guidesData.js`
```javascript
export const productGuideMapping = {
  'DURAFlex 4mm': 'duraflex_vach_trong_guide',
  'Tên sản phẩm mới': 'guide_key_moi'
};
```

#### Bước 3: Sản phẩm sẽ tự động hiển thị hướng dẫn!

## 📁 Cấu Trúc Dữ Liệu

### Cấu trúc Guide Object
```javascript
{
  steps: [
    {
      step_number: 1,           // Số thứ tự bước
      image_url: "filename.jpg", // Tên file hình (trong folder images)
      description: "Text..."     // Mô tả bước
    }
  ]
}
```

### Cấu trúc Product Mapping
```javascript
productGuideMapping = {
  'Tên sản phẩm': 'guide_key_từ_guides_json'
}
```

## 🎨 Tính Năng

✅ **Mở rộng/Thu gọn các bước** - Click vào header để mở/đóng chi tiết  
✅ **Hình ảnh minh họa** - Hiển thị ảnh cho mỗi bước  
✅ **Design responsive** - Tự động thích ứng với màn hình nhỏ  
✅ **Dark mode support** - Tự động theo theme của trang  
✅ **Animation mượt mà** - Transition khi mở/đóng bước  
✅ **Banner gradient** - Tiêu đề với background gradient xanh  

## 🔄 Flow Dữ Liệu

```
1. ProductDetailPage.jsx
   ├─ Fetch PRICES_URL
   ├─ Fetch PRODUCTS_URL
   └─ Fetch GUIDES_URL ← Hướng dẫn thi công
   
2. Lấy tên sản phẩm từ product variant
   └─ Tìm guide key từ productGuideMapping
   
3. GuideSection nhận dữ liệu guide
   └─ Render các bước với hình ảnh
```

## 📝 Ví Dụ Sử Dụng

### Hiển thị trên trang:
1. **Chi tiết sản phẩm** (hình, giá, thông số)
2. **Video YouTube** (nếu có youtube_id)
3. **📍 Hướng Dẫn Thi Công** ← VỊ TRÍ MỚI
4. **Bảo Hành** (thông tin, form)

## 🛠️ Tùy Chỉnh

### Thay đổi vị trí hiển thị:
Sửa trong `ProductDetailPage.jsx`, tìm dòng:
```jsx
{/* --- HƯỚNG DẪN THI CÔNG --- */}
{selectedGuideData && (
  <GuideSection guideData={selectedGuideData} />
)}
```

### Thay đổi style:
Chỉnh sửa `GuideSection.css` - các biến CSS:
- `--primary-green`: Màu chính
- `--card-background`: Nền card
- `--border-color`: Màu border

## ❌ Xử Lý Lỗi

### Nếu hướng dẫn không hiển thị:
1. Kiểm tra tên sản phẩm có đúng trong `productGuideMapping` không
2. Kiểm tra guide key có tồn tại trong `guides.json` không
3. Kiểm tra kết nối internet (để fetch dữ liệu từ GitHub)

### Nếu hình ảnh không hiển thị:
1. Kiểm tra `image_url` có đúng tên file không
2. Kiểm tra file hình có trong folder `images` trên GitHub không
3. Kiểm tra URL: `https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/images/filename.jpg`

## 📱 Responsive Design

- **Desktop (>768px)**: Full layout với gap 1.5rem
- **Tablet (768px)**: Còn khá rộng, tất cả các tính năng bình thường
- **Mobile (<480px)**: Font nhỏ hơn, padding giảm, hình ảnh max-height: 300px

## 🔗 Liên Kết Tệp

- Data source: `https://github.com/nguyenthong123/dashboard-data/blob/main/data/guides.json`
- Component: `/src/components/products/GuideSection.jsx`
- Stylesheet: `/src/components/products/GuideSection.css`
- Config: `/src/config/guidesData.js`
- Page: `/src/pages/ProductDetailPage.jsx`

## ✨ Đặc Điểm Nổi Bật

1. **Tự động lấy dữ liệu** - Không cần cấu hình thêm
2. **Linh hoạt** - Dễ thêm sản phẩm mới
3. **Hiệu suất cao** - Dữ liệu được cache bởi hook useFetchData
4. **Truy cập nhanh** - Mở/đóng bước không load lại trang
5. **SEO friendly** - Dữ liệu từ GitHub công khai

---

**Bây giờ bạn đã sẵn sàng! Hãy cập nhật `guides.json` với các sản phẩm của bạn để bắt đầu! 🎉**
