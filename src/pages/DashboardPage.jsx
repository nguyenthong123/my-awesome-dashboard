import React from 'react';
import useFetchData from '../hooks/useFetchData';

// URLs đến các file dữ liệu đơn hàng
const ORDERS_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/orderData.json';
const ORDER_DETAILS_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/orderDetails.json';

function DashboardPage() {
  // Gọi API để lấy danh sách đơn hàng và chi tiết đơn hàng
  const { data: orders, isLoading: isLoadingOrders } = useFetchData(ORDERS_URL);
  const { data: orderDetails, isLoading: isLoadingDetails } = useFetchData(ORDER_DETAILS_URL);

  // Hiển thị loading trong khi chờ tải dữ liệu
  if (isLoadingOrders || isLoadingDetails) {
    return <div style={{ padding: '1rem' }}>Loading dashboard data...</div>;
  }

  // Xử lý lỗi nếu không tải được dữ liệu
  if (!orders || !orderDetails) {
    return <div style={{ padding: '1rem' }}>Could not load order data.</div>;
  }

  // --- BẮT ĐẦU XỬ LÝ VÀ HIỂN THỊ DỮ LIỆU ---

  // Ví dụ: Tính tổng doanh thu
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_price || 0), 0);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Admin Dashboard</h1>
      
      {/* Phần thống kê tổng quan */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ border: '1px solid black', padding: '1rem' }}>
          <h3>Tổng số đơn hàng</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{orders.length}</p>
        </div>
        <div style={{ border: '1px solid black', padding: '1rem' }}>
          <h3>Tổng doanh thu</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {totalRevenue.toLocaleString('vi-VN')} VNĐ
          </p>
        </div>
      </div>

      {/* Phần bảng danh sách đơn hàng */}
      <h2>Danh sách đơn hàng gần đây</h2>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px' }}>Mã Đơn Hàng</th>
            <th style={{ padding: '8px' }}>Tên Khách Hàng</th>
            <th style={{ padding: '8px' }}>Ngày Đặt</th>
            <th style={{ padding: '8px' }}>Tổng Tiền</th>
            <th style={{ padding: '8px' }}>Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {orders.slice(0, 10).map(order => (
            // Dòng <tr> này là nơi cần thêm key
            <tr key={order.id_order}> {/* <-- ĐÃ THÊM KEY VÀO ĐÂY */}
              <td style={{ padding: '8px' }}>{order.id_order || 'N/A'}</td>
              <td style={{ padding: '8px' }}>{order.name || 'N/A'}</td>
              <td style={{ padding: '8px' }}>
                {order.date_order ? new Date(order.date_order).toLocaleDateString('vi-VN') : 'N/A'}
              </td>
              <td style={{ padding: '8px', textAlign: 'right' }}>
                {order.total_price?.toLocaleString('vi-VN') || '0'} VNĐ
              </td>
              <td style={{ padding: '8px' }}>{order.status || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phần dành cho biểu đồ, sẽ phát triển sau */}
      <div style={{ marginTop: '2rem' }}>
          <h2>Biểu đồ thống kê (sẽ phát triển sau)</h2>
          <p>Khu vực này sẽ chứa các biểu đồ thống kê doanh thu theo thời gian.</p>
      </div>
    </div>
  );
}

export default DashboardPage;