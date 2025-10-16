import React, { useState, useMemo, useEffect } from 'react';
import useFetchData from '../hooks/useFetchData';
import { useAuth } from '../context/AuthContext';
import './ProductsPage.css';
import './DashboardPage.css';

const ORDERS_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/orderData.json';
const ORDER_DETAILS_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/orderDetails.json';

// --- COMPONENT CON: MODAL (Sao chép từ DashboardPage.jsx) ---
function OrderDetailsModal({ order, details, onClose }) {
  // ... (Toàn bộ code của component này được giữ nguyên)
}

// --- COMPONENT CON: PHÂN TRANG (Sao chép từ DashboardPage.jsx) ---
function Pagination({ itemsPerPage, totalItems, paginate, currentPage }) {
  // ... (Toàn bộ code của component này được giữ nguyên)
}

// --- COMPONENT CHÍNH ---
function CustomerRevenuePage() {
  const { user } = useAuth();
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  
  const [customerFilter] = useState(user?.name || '');

  const { data: rawOrders, isLoading: isLoadingOrders } = useFetchData(ORDERS_URL);
  const { data: rawOrderDetails, isLoading: isLoadingDetails } = useFetchData(ORDER_DETAILS_URL);

  const orders = useMemo(() => {
    if (!rawOrders) return [];
    return Array.isArray(rawOrders) ? rawOrders : Object.values(rawOrders);
  }, [rawOrders]);

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];
    
    if (customerFilter) {
      filtered = filtered.filter(order => 
        order["tên khách hàng"] && order["tên khách hàng"].toLowerCase().includes(customerFilter.toLowerCase())
      );
    }
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
    return filtered;
  }, [orders, customerFilter, startDate, endDate, statusFilter]);
  
  const availableStatuses = useMemo(() => {
    const statuses = new Set(filteredOrders.map(order => order["trạng thái"]).filter(Boolean));
    return ['Tất cả', ...statuses];
  }, [filteredOrders]);

  const selectedOrderDetails = useMemo(() => {
    if (!selectedOrder || !rawOrderDetails) return [];
    return rawOrderDetails[selectedOrder["id order"]] || [];
  }, [selectedOrder, rawOrderDetails]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate, statusFilter]);

  if (isLoadingOrders || isLoadingDetails) {
    return <div className="page-container">Đang tải dữ liệu...</div>;
  }
  
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (parseFloat(order["tổng phụ"]) || 0), 0);
  const totalPackages = filteredOrders.reduce((sum, order) => sum + (parseInt(order["tổng kiện trong đơn"], 10) || 0), 0);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="page-container">
      <h1>Doanh thu của: {user?.name}</h1>
      
      <div className="filter-container">
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} title="Từ ngày" />
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} title="Đến ngày" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {availableStatuses.map(status => <option key={status} value={status}>{status || 'Chưa có'}</option>)}
        </select>
        <input 
          type="text" 
          placeholder="Tên khách hàng"
          value={customerFilter} 
          disabled 
        />
      </div>

      <div className="stats-container">
        <div className="stat-card"><h3>Tổng số đơn hàng</h3><p>{filteredOrders.length}</p></div>
        <div className="stat-card"><h3>Tổng doanh thu</h3><p>{totalRevenue.toLocaleString('vi-VN')} VNĐ</p></div>
        <div className="stat-card"><h3>Tổng kiện</h3><p>{totalPackages}</p></div>
      </div>

      <h2>Danh sách đơn hàng</h2>
      <div className="table-container">
        <table className="product-price-table">
          <thead>
            <tr>
              <th>Thời gian lên đơn</th>
              <th>Mã Đơn Hàng</th>
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

export default CustomerRevenuePage;