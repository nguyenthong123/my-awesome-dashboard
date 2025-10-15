import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import RouteChangeTracker from './components/common/RouteChangeTracker'; // <-- THÊM DÒNG NÀY
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouteChangeTracker />
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;