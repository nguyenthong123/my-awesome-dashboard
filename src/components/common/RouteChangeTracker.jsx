import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const RouteChangeTracker = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  // Khởi tạo GA4 (chạy 1 lần duy nhất)
  useEffect(() => {
    // Thay "G-XXXXXXXXXX" bằng Measurement ID của bạn
    ReactGA.initialize("G-VK8GT2NP53"); // Đã sửa lỗi thiếu dấu "
    setInitialized(true);
  }, []);

  // Gửi sự kiện pageview mỗi khi URL thay đổi
  useEffect(() => {
    if (initialized) {
      ReactGA.send({ hitType: "pageview", page: location.pathname + location.search + location.hash });
    }
  }, [initialized, location]);

  return null; // Component này không render ra bất cứ thứ gì trên giao diện
};

export default RouteChangeTracker;