import React, { useState, useMemo } from 'react';
import useFetchData from '../hooks/useFetchData';
import './ProductsPage.css'; // Tái sử dụng CSS của bảng giá

const ORDERS_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/orderData.json';
const ORDER_DETAILS_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/orderDetails.json';

// --- COMPONENT CON: MODAL CHI TIẾT ĐƠN HÀNG ---
function OrderDetailsModal({ order, details, onClose }) {
  const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 1001,
  };
  const modalContentStyle = {
    position: 'relative',
    backgroundColor: 'white', padding: '2rem', borderRadius: '8px',
    width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto',
  };
  const closeButtonStyle = {
    position: 'absolute', top: '10px', right: '15px',
    background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer',
    color: '#666'
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyle} onClick={onClose}>&times;</button>
        <h2>Chi tiết Đơn hàng: {order["id order"]}</h2>
        <p><strong>Khách hàng:</strong> {order["tên khách hàng"]}</p>
        <p><strong>Ngày đặt:</strong> {order["thời gian lên đơn"] ? new Date(order["thời gian lên đơn"]).toLocaleDateString('vi-VN') : ''}</p>
        
        <h4 style={{marginTop: '2rem'}}>Các sản phẩm trong đơn:</h4>
        <div className="table-container">
          <table className="product-price-table">
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Kích Thước</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {details.length > 0 ? (
                details.map((item, index) => {
                  const price = parseFloat(item["giá tiền"]) || 0;
                  const total = parseFloat(item["Thành tiền"]) || 0;
                  return (
                    <tr key={item["id order chi tiết"] || index}>
                      <td>{item["tên sp"] || ''}</td>
                      <td>{item["Kích Thước"] || ''}</td>
                      <td>{item["số lượng"]} {item["đơn vị tính"]}</td>
                      <td style={{ textAlign: 'right' }}>{price.toLocaleString('vi-VN')}</td>
                      <td style={{ textAlign: 'right' }}>{total.toLocaleString('vi-VN')}</td>
                    </tr>
                  )
                })
              ) : (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Không tìm thấy chi tiết cho đơn hàng này.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// --- COMPONENT CON: PHÂN TRANG (ĐÃ SỬA CẢNH BÁO CSS) ---
function Pagination({ itemsPerPage, totalItems, paginate, currentPage }) {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }
  const paginationStyle = { display: 'flex', justifyContent: 'center', listStyle: 'none', padding: 0, marginTop: '2rem' };
  const baseLinkStyle = {
    color: '#007bff', padding: '8px 16px', textDecoration: 'none', 
    margin: '0 4px', borderRadius: '4px', borderWidth: '1px',
    borderStyle: 'solid', borderColor: '#dee2e6', transition: 'all 0.2s',
  };
  const activePageLinkStyle = { 
    backgroundColor: '#007bff', color: 'white', borderColor: '#007bff'
  };

  return (
    <nav>
      <ul style={paginationStyle}>
        {pageNumbers.map(number => (
          <li key={number}>
            <a onClick={(e) => { e.preventDefault(); paginate(number); }} href="!#" style={currentPage === number ? { ...baseLinkStyle, ...activePageLinkStyle } : baseLinkStyle}>
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}


// --- COMPONENT CHÍNH (ĐÃ SỬA LỖI LOGIC LỌC) ---
function DashboardPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { data: rawOrders, isLoading: isLoadingOrders } = useFetchData(ORDERS_URL);
  const { data: rawOrderDetails, isLoading: isLoadingDetails } = useFetchData(ORDER_DETAILS_URL);

  // Hook useMemo để lọc chi tiết đơn hàng
  const selectedOrderDetails = useMemo(() => {
    // Trả về mảng rỗng nếu chưa có dữ liệu cần thiết
    if (!selectedOrder || !rawOrderDetails) return [];
    
    // Chuyển đổi dữ liệu chi tiết thành mảng nếu cần
    const orderDetails = Array.isArray(rawOrderDetails) ? rawOrderDetails : Object.values(rawOrderDetails);
    
    // Làm sạch ID của đơn hàng đang được chọn
    const cleanedSelectedOrderId = String(selectedOrder["id order"]).trim().toLowerCase();
    
    // Lọc ra các chi tiết có ID khớp
    return orderDetails.filter(detail => {
      // Bỏ qua nếu chi tiết không có ID
      if (!detail["id order"]) return false;
      
      // Làm sạch ID của chi tiết để so sánh
      const cleanedDetailOrderId = String(detail["id order"]).trim().toLowerCase();
      
      return cleanedDetailOrderId === cleanedSelectedOrderId;
    });
  }, [selectedOrder, rawOrderDetails]); // Chạy lại mỗi khi selectedOrder hoặc rawOrderDetails thay đổi

  if (isLoadingOrders || isLoadingDetails) {
    return <div className="page-container">Loading dashboard data...</div>;
  }

  if (!rawOrders || !rawOrderDetails) {
    return <div className="page-container">Could not load order data.</div>;
  }

  const orders = Array.isArray(rawOrders) ? rawOrders : Object.values(rawOrders);
  
  const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order["tổng tiền dịch vụ"]) || 0), 0);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="page-container">
      <h1>Admin Dashboard</h1>
      
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <h3>Tổng số đơn hàng</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{orders.length}</p>
        </div>
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <h3>Tổng doanh thu</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
            {totalRevenue.toLocaleString('vi-VN')} VNĐ
          </p>
        </div>
      </div>

      <h2>Danh sách đơn hàng gần đây</h2>
      <div className="table-container">
        <table className="product-price-table">
          <thead>
            <tr>
              <th>Thời gian lên đơn</th>
              <th>Mã Đơn Hàng</th>
              <th>Tên Khách Hàng</th>
              <th>Trạng Thái</th>
              <th>Tổng phụ</th>
              <th>Số tiền còn lại</th>
              <th>Tổng kiện</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, index) => {
              const subTotal = parseFloat(order["tổng phụ"]);
              const remainingAmount = parseFloat(order["số tiền còn lại trong đơn"]);
              return (
                <tr key={order["id order"] || index} onClick={() => setSelectedOrder(order)} style={{ cursor: 'pointer' }}>
                  <td>{order["thời gian lên đơn"] ? new Date(order["thời gian lên đơn"]).toLocaleDateString('vi-VN') : ''}</td>
                  <td>{order["id order"]}</td>
                  <td>{order["tên khách hàng"]}</td>
                  <td>{order["trạng thái"] || ''}</td>
                  <td style={{ textAlign: 'right' }}>{subTotal > 0 ? `${subTotal.toLocaleString('vi-VN')} VNĐ` : ''}</td>
                  <td style={{ textAlign: 'right' }}>{remainingAmount > 0 ? `${remainingAmount.toLocaleString('vi-VN')} VNĐ` : ''}</td>
                  <td>{order["tổng kiện trong đơn"] || ''}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Pagination 
        itemsPerPage={itemsPerPage} 
        totalItems={orders.length} 
        paginate={paginate}
        currentPage={currentPage}
      />
      
      <div style={{ marginTop: '2rem' }}>
          <h2>Biểu đồ thống kê (sẽ phát triển sau)</h2>
          <p>Khu vực này sẽ chứa các biểu đồ thống kê doanh thu theo thời gian.</p>
      </div>

      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          details={selectedOrderDetails}
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
}

export default DashboardPage;