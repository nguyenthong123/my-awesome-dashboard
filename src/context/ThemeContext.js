import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  // 1. State để lưu theme hiện tại, đọc từ localStorage hoặc mặc định là 'light'
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // 2. useEffect để áp dụng theme vào thẻ <html>
  useEffect(() => {
    // Lấy thẻ <html>
    const root = window.document.documentElement;
    
    const oldTheme = theme === 'light' ? 'dark' : 'light';
    root.classList.remove(oldTheme);
    root.classList.add(theme); // Thêm class 'light' hoặc 'dark'

    // 3. Lưu lựa chọn vào localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}