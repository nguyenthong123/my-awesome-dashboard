// src/utils/imageLoader.js

function importAll(r) {
  let images = {};
  r.keys().forEach((item) => { 
    images[item.replace('./', '')] = r(item); 
  });
  return images;
}

// Đường dẫn đúng: từ `src/utils` đi ra (`..`), rồi vào `assets/images`
const images = importAll(require.context('../assets/images', false, /\.(png|jpe?g|svg)$/));

export const getProductImage = (imageFilename) => {
  if (!imageFilename || !images[imageFilename]) {
    try {
      // Đường dẫn đến placeholder cũng phải đúng
      return require('../assets/images/placeholder.png');
    } catch (e) {
      return null;
    }
  }
  return images[imageFilename];
};