import React, { createContext, useState, useContext, useEffect } from 'react';
import useFetchData from '../hooks/useFetchData';

const USERS_DATA_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/users.json';
const AuthContext = createContext(null);

const getUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    localStorage.removeItem('user'); // Dọn dẹp nếu dữ liệu bị hỏng
    return null;
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(getUserFromStorage());
  const { data: allUsers, isLoading: isLoadingUsers } = useFetchData(USERS_DATA_URL);

  const login = (email) => {
    if (!allUsers) return false;
    const foundUser = allUsers.find(user => user.mail === email);
    if (foundUser) {
      setCurrentUser(foundUser); // Trigger useEffect để lưu vào storage
      console.log('Đăng nhập thành công:', foundUser);
      return true;
    }
    alert("Email không tồn tại trong hệ thống!");
    return false;
  };

  const logout = () => {
    setCurrentUser(null); // Trigger useEffect để xóa khỏi storage
    console.log('Đã đăng xuất');
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('user');
    }
  }, [currentUser]);

  const value = { user: currentUser, login, logout, isLoadingUsers };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}