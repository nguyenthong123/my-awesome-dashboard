// Trong src/App.js
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import RouteChangeTracker from './components/common/RouteChangeTracker'; // <-- Import component
import './App.css';

function App() {
  return (
    <AuthProvider>
      <RouteChangeTracker /> {/* <-- Thêm vào đây */}
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;