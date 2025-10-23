// src/config/warrantyData.js
import warrantyBanner from '../assets/images/warranty-banner.jpg';

export const warrantyDetails = {
  'duraflex_5_nam': {
    type: 'Bảo hành cao cấp',
    productLine: 'Tấm xi măng DURAflex',
    duration: '5 năm',
    bannerImage: warrantyBanner,
    documentRequired: [
      'Hóa đơn mua hàng',
      'Phiếu bảo hành sản phẩm',
      'Hình ảnh sản phẩm lỗi (nếu có)'
    ],
    sections: [
      {
        title: 'I. PHẠM VI BẢO HÀNH',
        content: `Chế độ bảo hành này áp dụng cho:
1. Tấm xi măng DURAflex được sản xuất theo tiêu chuẩn ASTM C1186, TCVN 8258
2. Thời hạn bảo hành: 5 năm kể từ ngày mua hàng (theo hóa đơn)
3. Phạm vi: Toàn bộ tính chất cơ lý của sản phẩm theo tiêu chuẩn công bố`
      },
      {
        title: 'II. ĐIỀU KIỆN BẢO HÀNH',
        content: `Sản phẩm được bảo hành khi đáp ứng các điều kiện sau:
1. Còn trong thời hạn bảo hành
2. Có đầy đủ hóa đơn mua hàng và QR trên tấm
3. Sản phẩm bị lỗi do quá trình sản xuất
4. Được lắp đặt và sử dụng theo đúng hướng dẫn của nhà sản xuất
5. Được bảo quản theo đúng điều kiện quy định trong catalog sản phẩm`
      },
      {
        title: 'III. CÁC TRƯỜNG HỢP KHÔNG ĐƯỢC BẢO HÀNH',
        content: `Sản phẩm không được bảo hành trong các trường hợp sau:
1. Hết thời hạn bảo hành
2. Không có hóa đơn mua hàng hoặc phiếu bảo hành
3. Tự ý sửa chữa khi chưa có ý kiến của bộ phận kỹ thuật
4. Lắp đặt sai quy cách kỹ thuật
5. Hư hỏng do vận chuyển và lưu kho không đúng cách
6. Sử dụng sai mục đích thiết kế
7. Các trường hợp bất khả kháng: thiên tai, hỏa hoạn, chiến tranh...
8. Hao mòn tự nhiên trong quá trình sử dụng
9. Sản phẩm bị biến dạng do kết cấu công trình không ổn định`
      },
      {
        title: 'IV. QUY TRÌNH BẢO HÀNH',
        content: `1. Khách hàng thông báo tình trạng hư hỏng cho Nhà sản xuất hoặc đơn vị được ủy quyền bảo hành.
2. Bộ phận kỹ thuật sẽ kiểm tra và xác nhận tình trạng hư hỏng.
3. Nếu thuộc diện bảo hành, Nhà sản xuất sẽ thực hiện việc sửa chữa hoặc thay thế sản phẩm mới.
4. Thời gian xử lý bảo hành: tối đa 14 ngày làm việc kể từ ngày nhận thông báo.`
      }
    ]
  },
  'duraflex_basic': {
    type: 'Bảo hành tiêu chuẩn',
    productLine: 'Tấm xi măng DURAflex',
    duration: '2 năm',
    bannerImage: warrantyBanner,
    documentRequired: [
      'Hóa đơn mua hàng',
      'Phiếu bảo hành sản phẩm',
      'Hình ảnh sản phẩm lỗi (nếu có)'
    ],
    sections: [
      {
        title: 'I. PHẠM VI BẢO HÀNH',
        content: `Chế độ bảo hành này áp dụng cho:
1. Tấm xi măng DURAflex được sản xuất theo tiêu chuẩn ASTM C1186, TCVN 8258
2. Thời hạn bảo hành: 2 năm kể từ ngày mua hàng (theo hóa đơn)
3. Phạm vi: Toàn bộ tính chất cơ lý của sản phẩm theo tiêu chuẩn công bố`
      },
      {
        title: 'II. ĐIỀU KIỆN BẢO HÀNH',
        content: `Sản phẩm được bảo hành khi đáp ứng các điều kiện sau:
1. Còn trong thời hạn bảo hành
2. Có đầy đủ hóa đơn mua hàng và phiếu bảo hành
3. Sản phẩm bị lỗi do quá trình sản xuất
4. Được lắp đặt và sử dụng theo đúng hướng dẫn của nhà sản xuất
5. Được bảo quản theo đúng điều kiện quy định trong catalog sản phẩm`
      },
      {
        title: 'III. CÁC TRƯỜNG HỢP KHÔNG ĐƯỢC BẢO HÀNH',
        content: `Sản phẩm không được bảo hành trong các trường hợp sau:
1. Hết thời hạn bảo hành
2. Không có hóa đơn mua hàng hoặc phiếu bảo hành
3. Tự ý sửa chữa khi chưa có ý kiến của bộ phận kỹ thuật
4. Lắp đặt sai quy cách kỹ thuật
5. Hư hỏng do vận chuyển và lưu kho không đúng cách
6. Sử dụng sai mục đích thiết kế
7. Các trường hợp bất khả kháng: thiên tai, hỏa hoạn, chiến tranh...
8. Hao mòn tự nhiên trong quá trình sử dụng
9. Sản phẩm bị biến dạng do kết cấu công trình không ổn định`
      },
      {
        title: 'IV. QUY TRÌNH BẢO HÀNH',
        content: `1. Khách hàng thông báo tình trạng hư hỏng cho Nhà sản xuất hoặc đơn vị được ủy quyền bảo hành.
2. Bộ phận kỹ thuật sẽ kiểm tra và xác nhận tình trạng hư hỏng.
3. Nếu thuộc diện bảo hành, Nhà sản xuất sẽ thực hiện việc sửa chữa hoặc thay thế sản phẩm mới.`
      }
    ]
  }
};