import React, { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import useFetchData from '../../hooks/useFetchData';
import './WarrantySection.css';

// Cấu hình EmailJS (kế thừa từ trước)
const EMAILJS_SERVICE_ID = 'service_cmur83g';
const EMAILJS_TEMPLATE_ID = 'template_jvhla1o';
const EMAILJS_PUBLIC_KEY = 'ucjcJro8eNU36M-J4';

// Cấu hình Cloudinary (kế thừa từ trước)
const CLOUDINARY_CLOUD_NAME = 'dtdgrcznj';
const CLOUDINARY_API_KEY = '693591154735455';

// Google Apps Script deployment URL - ⚠️ BẠN CẦN CẬP NHẬT URL NÀY
// Sau khi deploy Apps Script trên Google, copy URL đặt ở đây
const APPS_SCRIPT_URL = 'https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercopy'; // ← Thay YOUR_DEPLOYMENT_ID

// Data source
const ORDER_DATA_URL = 'https://raw.githubusercontent.com/nguyenthong123/dashboard-data/main/data/orderData.json';

function WarrantySection({ warrantyData, productList }) {
  const form = useRef();
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [stores, setStores] = useState([]);
  const [location, setLocation] = useState(null);
  
  // Fetch order data to get list of stores
  const { data: orderData } = useFetchData(ORDER_DATA_URL);

  
  // Extract stores from orderData with status "Đơn Chốt"
  useEffect(() => {
    if (orderData && Array.isArray(orderData)) {
      const confirmedStores = orderData
        .filter(order => order['trạng thái'] === 'Đơn Chốt')
        .map(order => order['tên cửa hàng'])
        .filter((store, index, arr) => store && arr.indexOf(store) === index) // Unique stores
        .sort();
      setStores(confirmedStores);
    }
  }, [orderData]);

  // Get current user location
  const getLocation = () => {
    if (!navigator.geolocation) {
      setMessage('Trình duyệt không hỗ trợ xác định vị trí');
      return;
    }

    setMessage('Đang xác định vị trí...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat, lng });
        
        // Set location values in form (if you have hidden fields)
        if (form.current) {
          const latField = form.current.querySelector('input[name="latitude"]');
          const lngField = form.current.querySelector('input[name="longitude"]');
          if (latField) latField.value = lat;
          if (lngField) lngField.value = lng;
        }
        
        setMessage(`Vị trí: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        setTimeout(() => setMessage(''), 3000);
      },
      (error) => {
        setMessage(`Lỗi xác định vị trí: ${error.message}`);
      },
      { enableHighAccuracy: true }
    );
  };

  // Convert file to Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  };
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', CLOUDINARY_API_KEY);
      formData.append('folder', 'warranty_images');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          }
        }
      );

      const data = await response.json();
      
      if (response.ok && data.secure_url) {
        console.log('Upload successful:', data);
        return data.secure_url;
      } else {
        console.error('Upload failed:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
        throw new Error(
          data.error 
            ? `Cloudinary error: ${data.error.message}` 
            : `Upload failed with status ${response.status}`
        );
      }
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return null;
    }
  };

  // Send warranty data to Google Apps Script
  const sendToAppsScript = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setMessage('');

    try {
      // Validate form
      if (!form.current.name.value || !form.current.phone.value || 
          !form.current.product.value || !form.current.purchaseDate.value || 
          !form.current.description.value) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
      }

      setMessage('Đang xử lý hình ảnh...');

      // Process images to Base64
      const images = [];
      const fileInputs = form.current.querySelectorAll('input[type="file"]');
      let fileIndex = 1;
      
      for (const input of fileInputs) {
        if (input.files.length > 0) {
          const file = input.files[0];
          const base64 = await fileToBase64(file);
          images.push({
            name: `warranty_${Date.now()}_${fileIndex}.jpg`,
            data: base64,
            mimeType: file.type
          });
          fileIndex++;
        }
      }

      setMessage('Đang gửi dữ liệu...');

      // Prepare payload
      const payload = {
        name: form.current.name.value,
        phone: form.current.phone.value,
        address: form.current.address.value || '',
        product: form.current.product.value,
        purchaseDate: form.current.purchaseDate.value,
        description: form.current.description.value,
        store: form.current.store?.value || '',
        latitude: location?.lat || '',
        longitude: location?.lng || '',
        images: images
      };

      // Check if using Apps Script or fallback to EmailJS
      if (APPS_SCRIPT_URL && !APPS_SCRIPT_URL.includes('YOUR_DEPLOYMENT_ID')) {
        // Use Google Apps Script
        const response = await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();
        if (result.success) {
          setMessage(result.message || 'Yêu cầu của bạn đã được gửi thành công! Chúng tôi sẽ liên hệ lại sớm.');
          form.current.reset();
          setLocation(null);
        } else {
          throw new Error(result.message || 'Gửi thất bại');
        }
      } else {
        // Fallback: Use EmailJS (old method)
        await sendViaEmailJS(payload, images);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage(`Lỗi: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  // Fallback: Send via EmailJS
  const sendViaEmailJS = async (payload, images) => {
    const imageUrls = [];
    
    for (const img of images) {
      try {
        const formData = new FormData();
        formData.append('file', new Blob([Uint8Array.from(atob(img.data), c => c.charCodeAt(0))], { type: img.mimeType }));
        formData.append('api_key', CLOUDINARY_API_KEY);
        formData.append('folder', 'warranty_images');

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formData }
        );

        const data = await response.json();
        if (response.ok && data.secure_url) {
          imageUrls.push(data.secure_url);
        }
      } catch (error) {
        console.error('Image upload error:', error);
      }
    }

    emailjs.init(EMAILJS_PUBLIC_KEY);

    const templateParams = {
      product: payload.product,
      name: payload.name,
      phone: payload.phone,
      address: payload.address,
      purchaseDate: payload.purchaseDate,
      description: payload.description,
      store: payload.store,
      location: payload.latitude ? `${payload.latitude}, ${payload.longitude}` : 'N/A',
      imageUrls: imageUrls.join('\n'),
      reply_to: 'dunvex.green@gmail.com'
    };

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    if (result.text) {
      setMessage('Yêu cầu của bạn đã được gửi thành công! Chúng tôi sẽ liên hệ lại sớm.');
      form.current.reset();
      setLocation(null);
    }
  };

  const uploadToCloudinary = async (file) => {
    e.preventDefault();
    setIsSending(true);
    setMessage('');

    try {
      // Validate form
      if (!form.current.name.value || !form.current.phone.value || 
          !form.current.address.value || !form.current.product.value || 
          !form.current.purchaseDate.value || !form.current.description.value) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
      }

      // Handle image uploads
      const imageUrls = [];
      const fileInputs = form.current.querySelectorAll('input[type="file"]');
      
      for (const input of fileInputs) {
        if (input.files.length > 0) {
          setMessage('Đang tải ảnh lên...');
          const url = await uploadToCloudinary(input.files[0]);
          if (url) {
            imageUrls.push(url);
          }
        }
      }

      setMessage('Đang gửi yêu cầu bảo hành...');

      // Initialize EmailJS
      emailjs.init(EMAILJS_PUBLIC_KEY);

      // Prepare email parameters
      const templateParams = {
        product: form.current.product.value,
        name: form.current.name.value,
        phone: form.current.phone.value,
        address: form.current.address.value,
        purchaseDate: form.current.purchaseDate.value,
        description: form.current.description.value,
        imageUrls: imageUrls.join('\n'),
        reply_to: 'dunvex.green@gmail.com'
      };

      // Send email
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log('Email sent successfully:', result.text);
      setMessage('Yêu cầu của bạn đã được gửi thành công! Chúng tôi sẽ liên hệ lại sớm.');
      form.current.reset();
    } catch (error) {
      console.error('Error:', error);
      if (error.message === 'Vui lòng điền đầy đủ thông tin bắt buộc') {
        setMessage(error.message);
      } else if (error.message.includes('service ID is required')) {
        setMessage('Lỗi cấu hình hệ thống. Vui lòng liên hệ admin.');
      } else if (error.message.includes('dynamic variables are corrupted')) {
        setMessage('Lỗi định dạng dữ liệu. Vui lòng liên hệ admin.');
      } else {
        setMessage(`Gửi yêu cầu thất bại. Vui lòng thử lại sau. (${error.message})`);
      }
    } finally {
      setIsSending(false);
    }
  };

  if (!warrantyData) {
    return null;
  }

  return (
    <section className="warranty-section">
      <img src={warrantyData.bannerImage} alt="Bảo hành" className="warranty-banner" />
      
      {warrantyData.sections.map((section, index) => (
        <div key={index} className="warranty-content">
          <h3>{section.title}</h3>
          <p dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br />') }} />
        </div>
      ))}
      
      <div className="warranty-form-container">
        <h3>Yêu cầu Bảo hành</h3>
        <p>Vui lòng điền đầy đủ thông tin bên dưới.</p>
        
        <form ref={form} onSubmit={sendToAppsScript} className="warranty-form">
          <div className="form-group">
            <label htmlFor="name">Họ và tên</label>
            <input id="name" type="text" name="name" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input id="phone" type="tel" name="phone" required />
          </div>
          
          <div className="form-group full-width">
            <label htmlFor="address">Địa chỉ</label>
            <input id="address" type="text" name="address" />
          </div>
          
          <div className="form-group">
            <label htmlFor="product">Sản phẩm cần bảo hành</label>
            <select id="product" name="product" required>
              <option value="">-- Chọn sản phẩm --</option>
              {productList.map(p => (
                <option key={p.id_san_pham} value={p["Tên sản phẩm"]}>
                  {p["Tên sản phẩm"]}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="store">Cửa hàng</label>
            <div className="store-input-group">
              <select id="store" name="store">
                <option value="">-- Chọn cửa hàng --</option>
                {stores.map(store => (
                  <option key={store} value={store}>
                    {store}
                  </option>
                ))}
              </select>
              <button 
                type="button" 
                className="geolocation-btn"
                onClick={getLocation}
                title="Lấy vị trí hiện tại"
              >
                📍 Vị trí
              </button>
            </div>
          </div>
          
          {/* Hidden fields for geolocation */}
          <input type="hidden" name="latitude" />
          <input type="hidden" name="longitude" />
          
          <div className="form-group">
            <label htmlFor="purchaseDate">Ngày mua hàng</label>
            <input id="purchaseDate" type="date" name="purchaseDate" required />
          </div>
          
          <div className="form-group full-width">
            <label htmlFor="description">Mô tả lỗi sản phẩm</label>
            <textarea 
              id="description" 
              name="description" 
              rows="8" 
              placeholder="Vui lòng mô tả chi tiết về tình trạng lỗi của sản phẩm..."
              required
            ></textarea>
          </div>

          <div className="form-group full-width">
            <label>Hình ảnh đính kèm (nếu có)</label>
            <div className="file-inputs">
              <input type="file" name="image1" accept="image/*" />
              <input type="file" name="image2" accept="image/*" />
              <input type="file" name="image3" accept="image/*" />
              <input type="file" name="image4" accept="image/*" />
            </div>
          </div>
          
          <div className="form-group full-width">
            <button type="submit" disabled={isSending}>
              {isSending ? 'Đang xử lý...' : 'Gửi Yêu cầu'}
            </button>
          </div>
          
          {message && (
            <div className="form-group full-width">
              <p className={`form-message ${message.includes('thành công') ? 'success' : 'error'}`}>
                {message}
              </p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

export default WarrantySection;