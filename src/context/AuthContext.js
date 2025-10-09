import React, { createContext, useState, useContext } from 'react';
import useFetchData from '../hooks/useFetchData';

// URL Raw của file users.json trong repository dữ liệu của bạn
const USERS_DATA_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/users.json';

// 1. Tạo Context
const AuthContext = createContext(null);

// 2. Tạo Provider Component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  
  // Dùng hook useFetchData để tải dữ liệu tất cả người dùng
  const { data: allUsers, isLoading: isLoadingUsers } = useFetchData(USERS_DATA_URL);

  // Hàm xử lý đăng nhập (CHỈ CẦN EMAIL)
  const login = (email) => {
    if (!allUsers) {
      alert("Đang tải dữ liệu người dùng, vui lòng thử lại sau giây lát.");
      return false;
    }
    
    // Tìm người dùng trong danh sách chỉ dựa trên email
    const foundUser = allUsers.find((user) => user.mail === email);

    if (foundUser) {
      // Nếu tìm thấy, lưu thông tin vào state
      setCurrentUser(foundUser);
      console.log('Đăng nhập thành công:', foundUser);
      return true; // Báo thành công
    } else {
      // Nếu không tìm thấy
      alert("Email không tồn tại trong hệ thống!");
      console.log('Đăng nhập thất bại');
      return false; // Báo thất bại
    }
  };

  // Hàm xử lý đăng xuất
  const logout = () => {
    setCurrentUser(null);
    console.log('Đã đăng xuất');
  };

  // Giá trị mà Context sẽ cung cấp cho các component con
  const value = {
    user: currentUser,
    login,
    logout,
    isLoadingUsers,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Tạo một Custom Hook để dễ dàng sử dụng Context
export function useAuth() {
  return useContext(AuthContext);
}