// src/config/videoData.js

// --- BƯỚC 1: IMPORT CÁC ICON MÀ BẠN SẼ TẢI LÊN ---
// (Hãy đặt tên file icon cho đúng)
import floorIcon from '../assets/icons/floor-icon.png';
import mezzanineIcon from '../assets/icons/mezzanine-icon.png';
import interiorWallIcon from '../assets/icons/interior-wall-icon.png';
import exteriorWallIcon from '../assets/icons/exterior-wall-icon.png';
import floatingHouseIcon from '../assets/icons/floating-house-icon.png';

// --- BƯỚC 2: TẠO DANH SÁCH VIDEO ---
export const videos = [
  {
    id: 'lam-san',
    title: 'Làm Sàn',
    icon: floorIcon,
    youtubeId: 'k90pNr5C7jI' // <-- THAY BẰNG ID VIDEO LÀM SÀN
  },
  {
    id: 'lam-gac-lung',
    title: 'Làm Gác Lửng',
    icon: mezzanineIcon,
    youtubeId: 'wUpmEdL1oaI' // <-- THAY BẰNG ID VIDEO GÁC LỬNG
  },
  {
    id: 'lam-vach-trong',
    title: 'Làm Vách Trong',
    icon: interiorWallIcon,
    youtubeId: 'WNpgPsgi8vA' // <-- THAY BẰNG ID VIDEO VÁCH TRONG
  },
  {
    id: 'lam-vach-ngoai-van-go',
    title: 'Vách Ngoài Bằng Vân Gỗ',
    icon: exteriorWallIcon,
    youtubeId: '8SHjnGo8CGs' // <-- THAY BẰNG ID VIDEO VÁCH NGOÀI
  },
  {
    id: 'san-nha-hang-noi',
    title: 'Sàn Nhà Hàng Nổi',
    icon: floatingHouseIcon,
    youtubeId: 'DxIImA9Dv4E' // <-- THAY BẰNG ID VIDEO NHÀ HÀNG NỔI
  }
];