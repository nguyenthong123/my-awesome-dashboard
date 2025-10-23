import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './WarrantySection.css';

// Cấu hình EmailJS
const EMAILJS_SERVICE_ID = 'service_cmur83g';
const EMAILJS_TEMPLATE_ID = 'template_jvhla1o';
const EMAILJS_PUBLIC_KEY = 'ucjcJro8eNU36M-J4';

// Cấu hình Cloudinary
const CLOUDINARY_CLOUD_NAME = 'dtdgrcznj';
const CLOUDINARY_API_KEY = '693591154735455';

function WarrantySection({ warrantyData, productList }) {
  const form = useRef();
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');

  const uploadToCloudinary = async (file) => {
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

  const sendEmail = async (e) => {
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
        
        <form ref={form} onSubmit={sendEmail} className="warranty-form">
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
            <input id="address" type="text" name="address" required />
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