// src/utils/imageLoader.js

function importAll(r) {
  let images = {};
  r.keys().forEach((item) => { 
    images[item.replace('./', '')] = r(item); 
  });
  return images;
}

// *** ĐƯỜNG DẪN ĐÚNG: TÌM TRỰC TIẾP TRONG `images` ***
// Đường dẫn từ `src/utils` đi ra (`..`), rồi vào `assets/images`
const images = importAll(require.context('../assets/images', false, /\.(png|jpe?g|svg)$/));

export const getProductImage = (imageFilename) => {
  // Kiểm tra xem có tên file và file đó có tồn tại trong các file đã import không
  if (imageFilename && images[imageFilename]) {
    return images[imageFilename];
  }
  
  // Nếu không tìm thấy, trả về ảnh placeholder
  try {
    // Đường dẫn đến placeholder cũng phải đúng
    return require('../assets/images/placeholder.png');
  } catch (e) {
    // Nếu cả placeholder cũng lỗi, trả về null
    console.error("Placeholder image not found!");
    return null;
  }
};