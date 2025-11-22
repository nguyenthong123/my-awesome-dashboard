# 📋 Tóm Tắt: Form Bảo Hành + Google Apps Script

## ✅ Hoàn Thành

### 🎯 Tính Năng Mới
1. **✅ Google Apps Script Integration**
   - Lưu ảnh → Google Drive folder
   - Lưu dữ liệu + URL ảnh → Google Sheet `bao_hanh`

2. **✅ Dropdown Cửa Hàng**
   - Lấy danh sách từ `data/orderData.json`
   - Lọc chỉ những cửa hàng có trạng thái "Đơn Chốt"
   - Sắp xếp alphabetically

3. **✅ Nút Lấy Vị Trí (Geolocation)**
   - Nút 📍 "Vị trí" bên cạnh dropdown cửa hàng
   - Lấy GPS (Latitude/Longitude)
   - Lưu vào form (hidden fields)
   - Hiển thị vị trí trên screen

4. **✅ Fallback to EmailJS**
   - Nếu Apps Script URL chưa cập nhật, tự động dùng EmailJS (cách cũ)

---

## 📁 File Được Thay Đổi/Tạo

### Tạo Mới:
- `GOOGLE_APPS_SCRIPT.gs` — Script để deploy lên Google (copy & paste vào Google Apps Script)
- `SETUP_GOOGLE_APPS_SCRIPT.md` — Hướng dẫn setup chi tiết (5 bước)

### Cập Nhật:
- `src/components/products/WarrantySection.jsx` — Thêm logic + UI mới
- `src/components/products/WarrantySection.css` — CSS cho `.store-input-group` và `.geolocation-btn`
- `src/pages/ProductsPage.jsx` — Fix ESLint warning

### Backup:
- `src/components/products/WarrantySection_OLD.jsx` — Backup phiên bản cũ

---

## 🚀 Bước Tiếp Theo (Bạn Làm)

### 1️⃣ Deploy Google Apps Script
**Thời gian**: ~5-10 phút

1. Vào: https://script.google.com
2. Tạo project mới
3. Copy code từ `GOOGLE_APPS_SCRIPT.gs` → paste vào Google Apps Script
4. Click **Deploy** → **New deployment** → **Web app**
   - Execute as: Tài khoản Google của bạn
   - Who has access: Anyone
5. Copy **Deployment URL**

### 2️⃣ Cập Nhật APPS_SCRIPT_URL trong React
**Thời gian**: 1 phút

1. Mở: `src/components/products/WarrantySection.jsx`
2. Tìm:
   ```javascript
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercopy';
   ```
3. Thay `YOUR_DEPLOYMENT_ID` bằng ID từ URL ở bước 1
4. Commit & push:
   ```bash
   git add src/components/products/WarrantySection.jsx
   git commit -m "config: add Google Apps Script deployment URL"
   git push
   ```

### 3️⃣ Deploy Production (tuỳ chọn)
**Thời gian**: 2-5 phút
```bash
npm run build
npm run deploy
```

### 4️⃣ Test
**Thời gian**: 5 phút

1. Local: `npm start` → Vào trang sản phẩm → Scroll "Bảo hành"
2. Điền form đầy đủ
3. Chọn cửa hàng
4. Click 📍 → Cho phép location
5. Gửi yêu cầu
6. Kiểm tra:
   - Google Sheet: https://docs.google.com/spreadsheets/d/1xJ0V9adaKeF8fCCrv12g764HPfvJNER4Fn9tgfgLP6U
   - Google Drive: https://drive.google.com/drive/u/0/folders/1_ZZuREc6D0ydhDuDhAzrY9KqZspYKr4Y

---

## 📊 Form Fields (Hiện Tại)

| Field | Bắt buộc | Type | Ghi chú |
|-------|----------|------|---------|
| Họ tên | ✅ | Text | |
| SĐT | ✅ | Phone | |
| Địa chỉ | ❌ | Text | |
| Sản phẩm | ✅ | Select | Product list |
| **Cửa hàng** | ❌ | **Select** | **Từ orderData.json (lọc)** |
| Ngày mua | ✅ | Date | |
| Mô tả lỗi | ✅ | Textarea | |
| **Vị trí** | ❌ | **GPS Button** | **Nút 📍 lấy coords** |
| Hình ảnh | ❌ | File x4 | <5MB each |

---

## 📲 User Experience Flow

```
1. Người dùng vào trang chi tiết sản phẩm
   ↓
2. Scroll xuống → Khu vực "Bảo hành"
   ↓
3. Điền form (Họ tên, SĐT, Sản phẩm, Ngày mua, Mô tả)
   ↓
4. Chọn cửa hàng từ dropdown (tuỳ chọn)
   ↓
5. Click nút 📍 "Vị trí" → Cấp phép GPS → Hiển thị "Vị trí: X.XXXX, Y.YYYY"
   ↓
6. (Tuỳ chọn) Chọn ảnh để upload
   ↓
7. Click "Gửi Yêu cầu"
   ↓
8. React:
   - Chuyển ảnh → Base64
   - Gửi POST đến Google Apps Script
   ↓
9. Google Apps Script:
   - Nhận payload
   - Upload ảnh → Drive → Trả về public URL
   - Lưu dữ liệu + URLs → Sheet `bao_hanh`
   ↓
10. React nhận response:
    - Success: "Yêu cầu đã gửi thành công"
    - Error: Thông báo lỗi
    - Reset form
```

---

## 🔧 Cấu Hình Có Thể Tùy Chỉnh

Trong `WarrantySection.jsx`:
```javascript
// Để dùng EmailJS fallback (cách cũ)
// Nhận xét dòng:
// const APPS_SCRIPT_URL = '...';
// Hoặc giữ URL nhưng không cập nhật DEPLOYMENT_ID

// Để đổi source orderData
const ORDER_DATA_URL = 'https://...'; // Thay URL này

// Để lọc điều kiện cửa hàng khác
.filter(order => order['trạng thái'] === 'Đơn Chốt') // Đổi điều kiện
```

---

## ⚠️ Lưu Ý Quan Trọng

1. **Apps Script Deploy URL là bắt buộc**
   - Không có URL → Fallback EmailJS
   - EmailJS gửi email nhưng không lưu vào Sheet

2. **Geolocation yêu cầu HTTPS** (trên production)
   - Local development: OK
   - Prod: URL phải là HTTPS

3. **File size limit: 5MB/ảnh**
   - Nếu ảnh > 5MB → Lỗi upload
   - Khuyến khích: Nén ảnh 1-2MB

4. **Google Drive folder phải công khai**
   - Sheet & folder cần được share sao cho Apps Script có quyền
   - Deployment account = account quản lý Sheet & Drive

---

## 📞 Support

**Nếu gặp vấn đề:**

1. **Check console (F12)**
   - Xem lỗi chi tiết
   - Screenshot error → gửi support

2. **Check Google Apps Script Logs**
   - Vào: script.google.com → project
   - View → Logs
   - Xem error từ backend

3. **Test function**
   - Trong Google Apps Script editor
   - Click "Run" → "testSheet"
   - Kiểm tra console

4. **Kiểm tra quyền**
   - Vào Sheet → Share
   - Thêm email của deployment account
   - Give Editor access

---

## 🎊 Hoàn Tất!

**Git commits:**
```
✅ feat: integrate Google Apps Script + geolocation + store dropdown
✅ fix: add missing dependency to useMemo
```

**Branch**: `main` (ready for production)

**Status**: ✅ Ready to use (sau khi bạn cập nhật APPS_SCRIPT_URL)

---

## 📚 Tài Liệu Liên Quan

- `SETUP_GOOGLE_APPS_SCRIPT.md` — Hướng dẫn chi tiết (5 bước)
- `GOOGLE_APPS_SCRIPT.gs` — Script source code
- `src/components/products/WarrantySection.jsx` — React component
- `src/components/products/WarrantySection.css` — Styling

---

**Cảm ơn! Nếu có câu hỏi, hãy liên hệ! 🚀**
