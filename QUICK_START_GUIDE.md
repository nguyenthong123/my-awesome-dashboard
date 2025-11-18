# 🚀 Hướng Dẫn Cập Nhật Nhanh

## Để Hiển Thị Hướng Dẫn Thi Công Cho Sản Phẩm

### ✅ Bước 1: Kiểm Tra Tên Sản Phẩm Của Bạn

Truy cập: https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/prices.json

Tìm tên sản phẩm chính xác, ví dụ:
- `"Tên sản phẩm": "DURAFlex 4mm"`

### ✅ Bước 2: Kiểm Tra Guide ID Trong guides.json

Truy cập: https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/guides.json

Kiểm tra các guide key có sẵn, ví dụ:
- `"duraflex_vach_trong_guide": [...]`

### ✅ Bước 3: Cập Nhật guidesData.js

Sửa file: `/src/config/guidesData.js`

```javascript
export const productGuideMapping = {
  // Sản phẩm hiện tại (đã có)
  'DURAFlex 4mm': 'duraflex_vach_trong_guide',
  'DURAFlex 4,5mm': 'duraflex_vach_trong_guide',
  
  // ➕ Thêm sản phẩm mới ở đây
  'Tên sản phẩm của bạn': 'guide_id_tương_ứng',
  'Sản phẩm khác': 'guide_id_khác',
};
```

### ✅ Bước 4: Lưu & Test

- Commit changes
- Truy cập trang chi tiết sản phẩm
- Phần "Hướng Dẫn Thi Công" sẽ tự động xuất hiện!

---

## 📋 Danh Sách Sản Phẩm & Guide Mapping Hiện Tại

| Sản Phẩm | Guide ID | Trạng Thái |
|---------|----------|-----------|
| DURAFlex 4mm | duraflex_vach_trong_guide | ✅ Hoạt động |
| DURAFlex 4,5mm | duraflex_vach_trong_guide | ✅ Hoạt động |
| DURAFlex 8mm | duraflex_vach_trong_guide | ✅ Hoạt động |
| DURAFlex 10mm | duraflex_vach_trong_guide | ✅ Hoạt động |
| DURAFlex 12mm | duraflex_vach_trong_guide | ✅ Hoạt động |
| DURAFlex 15mm | duraflex_vach_trong_guide | ✅ Hoạt động |

---

## 🎯 Hướng Dẫn Thêm Sản Phẩm Mới

### Ví dụ: Thêm sản phẩm "DURAFlex 6mm"

**File: `/src/config/guidesData.js`**

```javascript
export const productGuideMapping = {
  'DURAFlex 4mm': 'duraflex_vach_trong_guide',
  'DURAFlex 4,5mm': 'duraflex_vach_trong_guide',
  'DURAFlex 6mm': 'duraflex_vach_trong_guide',  // ← Thêm dòng này
  'DURAFlex 8mm': 'duraflex_vach_trong_guide',
  // ... các sản phẩm khác
};
```

Lưu file → Hoàn tất!

---

## 🔍 Troubleshooting

### ❌ Hướng dẫn không hiển thị?

1. Kiểm tra tên sản phẩm trong `productGuideMapping` có đúng không (phải match 100% với "Tên sản phẩm" trong prices.json)
2. Kiểm tra guide ID có tồn tại trong guides.json không
3. Xóa cache browser (Ctrl+Shift+Delete) và reload

### ❌ Hình ảnh không hiển thị?

1. Kiểm tra `image_url` trong guides.json có đúng tên file không
2. Kiểm tra file hình có trong `/data/images/` trên GitHub không
3. Xem console browser (F12) để tìm chi tiết lỗi

---

## 💡 Mẹo

- **Không phân biệt chữ hoa/thường**: Nhưng phải khớp chính xác tên sản phẩm
- **Sử dụng cùng guide cho nhiều sản phẩm**: Tiết kiệm dữ liệu (như ví dụ trên)
- **Thêm guide mới**: Cập nhật trong `guides.json` trên GitHub, rồi thêm mapping
- **Thử test**: Kiểm tra trang chi tiết sản phẩm để xem kết quả

---

## 📞 Cần Giúp?

Kiểm tra những file sau:
- Guide data: https://github.com/nguyenthong123/dashboard-data/blob/main/data/guides.json
- Product list: https://github.com/nguyenthong123/dashboard-data/blob/main/data/prices.json
- Component: `/src/components/products/GuideSection.jsx`
- Config: `/src/config/guidesData.js`

**Happy coding! 🎉**
