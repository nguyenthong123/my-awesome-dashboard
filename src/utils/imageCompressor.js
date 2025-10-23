// Hàm nén ảnh sử dụng canvas
export const compressImage = async (file, maxSizeKB = 45) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Tính toán kích thước mới để giữ tỷ lệ
        const maxDimension = 1024;
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Thử các mức chất lượng khác nhau để đạt được kích thước mong muốn
        let quality = 0.7;
        let dataUrl;
        do {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          const sizeKB = Math.round((dataUrl.length * 3) / 4 / 1024);
          if (sizeKB <= maxSizeKB) break;
          quality -= 0.1;
        } while (quality > 0.1);

        // Convert base64 thành Blob
        const binary = atob(dataUrl.split(',')[1]);
        const array = [];
        for (let i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
        }
        const blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
        resolve(new File([blob], file.name, { type: 'image/jpeg' }));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};