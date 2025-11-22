# 🔧 Hướng Dẫn Setup Google Apps Script cho Form Bảo Hành

## 📋 Tóm Tắt
Form yêu cầu bảo hành sẽ:
- ✅ Lưu **hình ảnh** vào Google Drive folder: `1_ZZuREc6D0ydhDuDhAzrY9KqZspYKr4Y`
- ✅ Lưu **dữ liệu + đường dẫn ảnh** vào Google Sheet: `bao_hanh` (https://docs.google.com/spreadsheets/d/1xJ0V9adaKeF8fCCrv12g764HPfvJNER4Fn9tgfgLP6U)
- ✅ Hỗ trợ **dropdown danh sách cửa hàng** (từ orderData.json, lọc "Đơn Chốt")
- ✅ Hỗ trợ **nút lấy vị trí hiện tại** (GPS)

---

## 🚀 Bước 1: Tạo Google Apps Script

### 1.1. Truy cập Google Apps Script
1. Vào: https://script.google.com
2. Nếu lần đầu, có thể được yêu cầu tạo project mới
3. Click **"New Project"**

### 1.2. Xóa code mặc định và paste code mới
1. Xóa hết code mặc định trong `Code.gs`
2. Copy toàn bộ code từ file `GOOGLE_APPS_SCRIPT.gs` (trong project React)
3. Paste vào file `Code.gs` trên Google Apps Script

### 1.3. Sửa cấu hình
Tại đầu file, cập nhật:
```javascript
const SPREADSHEET_ID = '1xJ0V9adaKeF8fCCrv12g764HPfvJNER4Fn9tgfgLP6U';
const SHEET_NAME = 'bao_hanh';
const DRIVE_FOLDER_ID = '1_ZZuREc6D0ydhDuDhAzrY9KqZspYKr4Y';
```

---

## 🔐 Bước 2: Ghi Quyền Truy Cập

### 2.1. Cấp quyền cho Sheet & Folder
Khi chạy lần đầu:
1. Click **"Run"** (hoặc **"Execute"** → chọn function `testSheet`)
2. Có thể hiện thông báo xin quyền → Click **"Review permissions"**
3. Chọn tài khoản Google của bạn
4. Cho phép Apps Script truy cập:
   - Google Sheets
   - Google Drive

---

## 📤 Bước 3: Deploy as Web App

### 3.1. Tạo Deployment
1. Click **"Deploy"** (nút bên cạnh **"Run"**) → **"New deployment"**
2. Chọn type: **"Web app"**
3. Cài đặt:
   - **Execute as**: Chọn tài khoản Google của bạn (account nơi bạn quản lý Sheet & Drive)
   - **Who has access**: **"Anyone"** (để React app có thể gọi từ browser)
4. Click **"Deploy"**

### 3.2. Copy Deployment URL
1. Sau khi deploy, sẽ hiện một URL dạng:
   ```
   https://script.google.com/macros/d/DEPLOYMENT_ID/usercopy
   ```
2. **Copy toàn bộ URL này**

---

## 🔗 Bước 4: Cập Nhật React Code

### 4.1. Cập nhật APPS_SCRIPT_URL
1. Mở file: `src/components/products/WarrantySection.jsx`
2. Tìm dòng:
   ```javascript
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercopy';
   ```
3. Thay `YOUR_DEPLOYMENT_ID` bằng **Deployment ID** từ URL trên
   - **Ví dụ**: Nếu URL là `https://script.google.com/macros/d/1abc123xyz/usercopy`
   - Thì đặt: `const APPS_SCRIPT_URL = 'https://script.google.com/macros/d/1abc123xyz/usercopy';`

### 4.2. Commit & Push
```bash
cd /Users/zomby/my-awesome-dashboard
git add src/components/products/WarrantySection.jsx
git commit -m "feat: integrate Google Apps Script for warranty form"
git push origin main
```

### 4.3. Build & Deploy (nếu có)
```bash
npm run build
npm run deploy
```

---

## ✅ Bước 5: Kiểm Tra

### 5.1. Test trên local
1. Chạy dev server: `npm start`
2. Vào trang chi tiết sản phẩm → Scroll xuống "Bảo hành"
3. Điền form (ít nhất: Họ tên, SĐT, Sản phẩm, Ngày mua, Mô tả)
4. Chọn cửa hàng từ dropdown
5. Click nút **"📍 Vị trí"** để lấy GPS (sẽ yêu cầu cho phép location)
6. Click **"Gửi Yêu cầu"**

### 5.2. Kiểm tra kết quả
- **Google Sheet** `bao_hanh`: Xem hàng dữ liệu mới được thêm
  - Link: https://docs.google.com/spreadsheets/d/1xJ0V9adaKeF8fCCrv12g764HPfvJNER4Fn9tgfgLP6U/edit#gid=955766312
  - Xem cột **"Hình ảnh"** → có đường dẫn Google Drive link

- **Google Drive**: Xem ảnh được lưu trong folder
  - Link: https://drive.google.com/drive/u/0/folders/1_ZZuREc6D0ydhDuDhAzrY9KqZspYKr4Y

---

## 🐛 Troubleshooting

### Lỗi: "CORS error" hoặc "Failed to fetch"
**Nguyên nhân**: Browser chặn request từ `localhost` → domain public
**Giải pháp**:
1. Deploy app lên GitHub Pages / Vercel (production)
2. Hoặc lọc domain trong Google Apps Script (không khuyến khích)

### Lỗi: "Sheet not found"
**Nguyên nhân**: `SHEET_NAME` hoặc `SPREADSHEET_ID` sai
**Giải pháp**:
1. Kiểm tra Sheet name chính xác (case-sensitive)
2. Kiểm tra Spreadsheet ID trong URL

### Lỗi: "Permission denied for Drive Folder"
**Nguyên nhân**: Apps Script không có quyền ghi Drive
**Giải pháp**:
1. Kiểm tra tài khoản Google dùng để deploy
2. Cấp quyền trực tiếp cho folder (Share → tài khoản Google)

### Ảnh không upload được
**Nguyên nhân**: 
- Kích thước ảnh > 5MB
- Trình duyệt chặn file
**Giải pháp**:
1. Nén ảnh trước khi upload
2. Thử trình duyệt khác
3. Kiểm tra console (F12) xem lỗi chi tiết

---

## 📞 Liên Hệ Support

Nếu gặp vấn đề, kiểm tra:
1. **Console (F12)** xem lỗi chi tiết
2. **Google Apps Script Logs** (Ctrl+Enter trong Apps Script editor)
3. **Google Sheet** xem có dòng dữ liệu nào được thêm không

---

## 🎯 Tính Năng Form

### Fields trong form:
| Field | Bắt buộc | Ghi chú |
|-------|----------|--------|
| Họ và tên | ✅ | Text input |
| Số điện thoại | ✅ | Phone input |
| Địa chỉ | ❌ | Text input |
| Sản phẩm | ✅ | Select (từ product list) |
| **Cửa hàng** | ❌ | **Dropdown từ orderData.json (lọc "Đơn Chốt")** |
| **Vị trí** | ❌ | **Nút 📍 lấy GPS (Lat/Lng)** |
| Ngày mua | ✅ | Date input |
| Mô tả lỗi | ✅ | Textarea |
| Hình ảnh | ❌ | File input x4 (up to 5MB each) |

---

## 📊 Google Sheet Columns

Sheet `bao_hanh` sẽ có các cột:
```
A: Thời gian (VN timezone)
B: Họ tên
C: Điện thoại
D: Địa chỉ
E: Cửa hàng
F: Sản phẩm
G: Ngày mua
H: Mô tả lỗi
I: Vị trí (Lat)
J: Vị trí (Lng)
K: Hình ảnh (URLs cách nhau bằng " | ")
```

---

## 🔄 Fallback: Nếu Apps Script URL chưa cập nhật
Nếu bạn chưa cập nhật `APPS_SCRIPT_URL`, form sẽ tự động **fallback** sang **EmailJS** (cách cũ):
- ✅ Hình ảnh upload lên Cloudinary
- ✅ Email gửi về `dunvex.green@gmail.com`
- ❌ **Nhưng** không lưu vào Google Sheet & Drive

**Khuyến khích**: Luôn cập nhật `APPS_SCRIPT_URL` để sử dụng đầy đủ tính năng mới!

---

**Chúc mừng! 🎉 Form bảo hành của bạn đã sẵn sàng kết nối Google!**
