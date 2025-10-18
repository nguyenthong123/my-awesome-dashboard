import React, { useState, useMemo, useEffect } from 'react';
import useFetchData from '../hooks/useFetchData';
import './ProductsPage.css'; // Vẫn tái sử dụng style của bảng
import './DashboardPage.css'; // Import file CSS mới cho Dashboard
import DashboardCharts from '../components/dashboard/DashboardCharts'; // <-- Thêm import

const ORDERS_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/orderData.json';
const ORDER_DETAILS_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/orderDetails.json';

// --- COMPONENT CON: MODAL CHI TIẾT ĐƠN HÀNG ---
function OrderDetailsModal({ order, details, onClose }) {
  // Đã xóa toàn bộ các biến style inline (modalOverlayStyle, modalContentStyle...)

  return (
    // Sử dụng className cho các phần tử chính của Modal
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        
        {/* Nội dung bên trong Modal */}
        <h2>Chi tiết Đơn hàng: {order["id order"]}</h2>
        <p><strong>Khách hàng:</strong> {order["tên khách hàng"]}</p>
        <p><strong>Ngày đặt:</strong> {order["thời gian lên đơn"] ? new Date(order["thời gian lên đơn"]).toLocaleDateString('vi-VN') : ''}</p>
        
        <h4 style={{marginTop: '2rem'}}>Các sản phẩm trong đơn:</h4>
        
        <div className="table-container">
          <table className="product-price-table" style={{ tableLayout: 'auto' }}>
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
                  const total = parseFloat(item["tổng tiền"]) || 0;
                  return (
                    <tr key={item["id order chi tiết"] || index}>
                      <td style={{ whiteSpace: 'nowrap' }}>{item["tên sản phẩm"] || item["tên khóa kết hợp sp"] || ''}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{item["Kích Thước"] || ''}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{item["số lượng"]} {item["đơn vị tính"]}</td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{price.toLocaleString('vi-VN')}</td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{total.toLocaleString('vi-VN')}</td>
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

// --- COMPONENT CON: PHÂN TRANG ---
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

// --- COMPONENT CHÍNH ---
function DashboardPage() {
  // --- TẤT CẢ HOOKS ĐƯỢC GỌI Ở ĐẦU ---
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [customerFilter, setCustomerFilter] = useState('');

  const { data: rawOrders, isLoading: isLoadingOrders } = useFetchData(ORDERS_URL);
  const { data: rawOrderDetails, isLoading: isLoadingDetails } = useFetchData(ORDER_DETAILS_URL);
  
  const orders = useMemo(() => {
    if (!rawOrders) return [];
    return Array.isArray(rawOrders) ? rawOrders : Object.values(rawOrders);
  }, [rawOrders]);

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter(order => order["thời gian lên đơn"] && new Date(order["thời gian lên đơn"]) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(order => order["thời gian lên đơn"] && new Date(order["thời gian lên đơn"]) <= end);
    }
    if (statusFilter && statusFilter !== 'Tất cả') {
      filtered = filtered.filter(order => order["trạng thái"] === statusFilter);
    }
    if (customerFilter) {
      filtered = filtered.filter(order => 
        order["tên khách hàng"] && order["tên khách hàng"].toLowerCase().includes(customerFilter.toLowerCase())
      );
    }
    return filtered;
  }, [orders, startDate, endDate, statusFilter, customerFilter]);

  const availableStatuses = useMemo(() => {
    const statuses = new Set(orders.map(order => order["trạng thái"]).filter(Boolean));
    return ['Tất cả', ...statuses];
  }, [orders]);

  const availableCustomers = useMemo(() => {
    const customers = new Set(filteredOrders.map(order => order["tên khách hàng"]).filter(Boolean));
    return [...customers];
  }, [filteredOrders]);

  const selectedOrderDetails = useMemo(() => {
    if (!selectedOrder || !rawOrderDetails) return [];
    return rawOrderDetails[selectedOrder["id order"]] || [];
  }, [selectedOrder, rawOrderDetails]);

  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate, statusFilter, customerFilter]);

  // --- CÁC CÂU LỆNH RETURN SỚM ---
    if (isLoadingOrders || isLoadingDetails) {
    return <div className="page-container">Loading...</div>;
  }
  if (!rawOrders) {
    return <div className="page-container">Could not load order data.</div>;
  }

  
  // --- CÁC LOGIC TÍNH TOÁN CÒN LẠI ---
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (parseFloat(order["tổng phụ"]) || 0), 0);
  const totalPackages = filteredOrders.reduce((sum, order) => sum + (parseInt(order["tổng kiện trong đơn"], 10) || 0), 0);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="page-container">
      <h1>Admin Dashboard</h1>
      
      <div className="filter-container">
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} title="Từ ngày" />
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} title="Đến ngày" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {availableStatuses.map(status => <option key={status} value={status}>{status || 'Chưa có'}</option>)}
        </select>
        <input 
          type="text" 
          placeholder="Lọc theo tên khách hàng..."
          value={customerFilter} 
          onChange={e => setCustomerFilter(e.target.value)}
          list="customer-suggestions"
        />
        <datalist id="customer-suggestions">
          {availableCustomers.map(customer => <option key={customer} value={customer} />)}
        </datalist>
      </div>

       {/* --- KHU VỰC THỐNG KÊ (ĐÃ CẬP NHẬT) --- */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Tổng số đơn hàng</h3>
          <p>{filteredOrders.length}</p>
        </div>
        <div className="stat-card">
          <h3>Tổng doanh thu</h3>
          <p>{totalRevenue.toLocaleString('vi-VN')} VNĐ</p>
        </div>
        {/* THÊM THẺ MỚI CHO TỔNG KIỆN */}
        <div className="stat-card">
          <h3>Tổng kiện</h3>
          <p>{totalPackages}</p>
        </div>
      </div>

      <h2>Danh sách đơn hàng</h2>
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
        totalItems={filteredOrders.length} 
        paginate={paginate}
        currentPage={currentPage}
      />
      
       <div className="page-container">
      {/* ... (h1, filter, stats, bảng, pagination) */}
      
      {/* --- THAY THẾ KHU VỰC BIỂU ĐỒ --- */}
      <DashboardCharts orders={filteredOrders} />

      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          details={selectedOrderDetails}
          onClose={() => setSelectedOrder(null)} 
        />
      )}
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