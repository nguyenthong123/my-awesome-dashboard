// src/config/guidesData.js

export const guidesMapping = {
  // Hướng dẫn thi công cho vách trong
  'duraflex_vach_trong_guide': {
    guideKey: 'duraflex_vach_trong_guide',
    title: 'Hướng Dẫn Thi Công Vách Trong',
    description: 'Hướng dẫn chi tiết từng bước để thi công vách ngăn nội thất sử dụng tấm DURAFlex'
  },
  // Thêm các hướng dẫn khác khi cần
  // 'duraflex_san_guide': { ... }
  // 'duraflex_tran_guide': { ... }
};

// Ánh xạ tên sản phẩm hoặc product_slug đến guide_id
export const productGuideMapping = {
  // Các sản phẩm dành cho vách trong sẽ sử dụng hướng dẫn thi công vách
  'DURAFlex 4mm': 'duraflex_vach_trong_guide',
  'DURAFlex 4,5mm': 'duraflex_vach_trong_guide',
  'DURAFlex 8mm': 'duraflex_vach_trong_guide',
  'DURAFlex 10mm': 'duraflex_vach_trong_guide',
  'DURAFlex  10mm': 'duraflex_vach_trong_guide',
  'DURAFlex 12mm': 'duraflex_vach_trong_guide',
  'DURAFlex  12mm': 'duraflex_vach_trong_guide',
  'DURAFlex 14mm': 'duraflex_vach_trong_guide',
  'DURAFlex  14mm': 'duraflex_vach_trong_guide',
  'DURAFlex 15mm': 'duraflex_vach_trong_guide',
  'DURAFlex  15mm': 'duraflex_vach_trong_guide',
  'DURAFlex 16mm': 'duraflex_vach_trong_guide',
  'DURAFlex  16mm': 'duraflex_vach_trong_guide',
  'DURAFlex 18mm': 'duraflex_vach_trong_guide',
  'DURAFlex  18mm': 'duraflex_vach_trong_guide',
  'Tấm duraflex 9mm': 'duraflex_vach_trong_guide',

  // Có thể thêm các sản phẩm khác và hướng dẫn của chúng
  // 'Tên sản phẩm khác': 'duraflex_san_guide'
};

export default guidesMapping;
