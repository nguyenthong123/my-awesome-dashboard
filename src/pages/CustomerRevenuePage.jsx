import React, { useState, useMemo, useEffect } from 'react';
import useFetchData from '../hooks/useFetchData';
import './ProductsPage.css';
import './DashboardPage.css';
import DashboardCharts from '../components/dashboard/DashboardCharts';

const ORDERS_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/orderData.json';
const ORDER_DETAILS_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/orderDetails.json';
const TARGETS_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/targets.json';

// --- COMPONENT CON: MODAL CHI TIẾT ĐƠN HÀNG (ĐÃ CẬP NHẬT) ---
function OrderDetailsModal({ order, details, onClose }) {
  // Đã xóa các biến style inline

  return (
    // Sử dụng className thay vì style
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        
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
              ) : ( <tr><td colSpan="5" style={{ textAlign: 'center' }}>Không tìm thấy chi tiết cho đơn hàng này.</td></tr> )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENT CON: PHÂN TRANG (Giữ nguyên) ---
function Pagination({ itemsPerPage, totalItems, paginate, currentPage }) {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }
  const paginationStyle = { display: 'flex', justifyContent: 'center', listStyle: 'none', padding: 0, marginTop: '2rem' };
  const baseLinkStyle = {
    color: 'var(--primary-blue)', padding: '8px 16px', textDecoration: 'none', 
    margin: '0 4px', borderRadius: '4px', borderWidth: '1px',
    borderStyle: 'solid', borderColor: 'var(--border-color)', transition: 'all 0.2s',
    backgroundColor: 'var(--card-background)'
  };
  const activePageLinkStyle = { 
    backgroundColor: 'var(--primary-blue)', color: 'white', borderColor: 'var(--primary-blue)'
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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [customerFilter, setCustomerFilter] = useState('');

  const { data: rawOrders, isLoading: isLoadingOrders } = useFetchData(ORDERS_URL);
  const { data: rawOrderDetails, isLoading: isLoadingDetails } = useFetchData(ORDER_DETAILS_URL);
  const { data: rawTargets, isLoading: isLoadingTargets } = useFetchData(TARGETS_URL);

  useEffect(() => { setCurrentPage(1); }, [startDate, endDate, statusFilter, customerFilter]);
  
  const orders = useMemo(() => { if (!rawOrders) return []; return Array.isArray(rawOrders) ? rawOrders : Object.values(rawOrders); }, [rawOrders]);
  const targets = useMemo(() => { if (!rawTargets) return []; return Array.isArray(rawTargets) ? rawTargets : Object.values(rawTargets); }, [rawTargets]);

  const filteredOrders = useMemo(() => { /* ... Giữ nguyên logic lọc ... */ });
  const availableStatuses = useMemo(() => { /* ... Giữ nguyên ... */ });
  const availableCustomers = useMemo(() => { /* ... Giữ nguyên ... */ });
  const selectedOrderDetails = useMemo(() => { /* ... Giữ nguyên ... */ });

  if (isLoadingOrders || isLoadingDetails || isLoadingTargets) {
    return <div className="page-container">Loading...</div>;
  }
  
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
        {/* ... JSX của bộ lọc ... */}
      </div>

      <div className="stats-container">
        {/* ... JSX của các thẻ thống kê ... */}
      </div>

      <h2>Danh sách đơn hàng</h2>
      <div className="table-container">
        <table className="product-price-table">
          {/* ... JSX của bảng ... */}
        </table>
      </div>

      <Pagination 
        itemsPerPage={itemsPerPage} 
        totalItems={filteredOrders.length} 
        paginate={paginate}
        currentPage={currentPage}
      />
      
      <DashboardCharts orders={filteredOrders} targets={targets} />

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