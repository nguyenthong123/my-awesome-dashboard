import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Đăng ký các thành phần
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function DashboardCharts({ orders }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="table-container" style={{padding: '2rem', textAlign: 'center', color: '#888'}}>
        <h2>Biểu đồ Thống kê</h2>
        <p>Không có dữ liệu để hiển thị biểu đồ.</p>
      </div>
    );
  }

  // --- Logic xử lý dữ liệu và chuyển đổi định dạng ngày ---
  const monthlyRevenue = orders.reduce((acc, order) => {
    // Parse ngày từ định dạng dd/MM/yyyy
    const [day, month, year] = (order["thời gian lên đơn"] || '').split('/');
    if (!day || !month || !year) return acc;

    const monthKey = `${year}-${month.padStart(2, '0')}`;
    const revenue = parseFloat(order["tổng phụ"]) || 0;
    
    acc[monthKey] = (acc[monthKey] || 0) + revenue;
    return acc;
  }, {});
  
  const sortedMonths = Object.keys(monthlyRevenue).sort();
  
  const chartData = {
    labels: sortedMonths.map(monthKey => {
      const [year, month] = monthKey.split('-');
      return `Tháng ${parseInt(month)}/${year}`;
    }),
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        data: sortedMonths.map(month => monthlyRevenue[month]),
        backgroundColor: 'rgba(40, 167, 69, 0.6)',
        borderColor: 'rgba(40, 167, 69, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Tổng quan Doanh thu theo Tháng' },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
  };

  return (
    // *** SỬ DỤNG LẠI className TỪ BẢNG ***
    <div className="table-container" style={{ marginTop: '3rem', padding: '2rem' }}>
      <h2>Biểu đồ Thống kê</h2>
      <Bar options={chartOptions} data={chartData} />
    </div>
  );
}

export default DashboardCharts;