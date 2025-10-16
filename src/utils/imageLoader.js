// src/utils/imageLoader.js

function importAll(r) {
  let images = {};
  r.keys().forEach((item) => { 
    images[item.replace('./', '')] = r(item); 
  });
  return images;
}

// *** SỬA LẠI ĐƯỜNG DẪN Ở ĐÂY ***
// Xóa `/products` để nó tìm trực tiếp trong `../assets/images`
const images = importAll(require.context('../assets/images', false, /\.(png|jpe?g|svg)$/));

export const getProductImage = (imageFilename) => {
  if (!imageFilename || !images[imageFilename]) {
    // File placeholder.png của bạn cũng nằm trong `../assets/images`
    try {
      return require('../assets/images/placeholder.png');
    } catch (e) {
      return null;
    }
  }
  return images[imageFilename];
};