import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './WarrantySection.css';
import warrantyBanner from '../../assets/images/warranty-banner.jpg';

function WarrantySection({ warrantyData, productList }) {
  const form = useRef();
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  
  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);
    setMessage('');

    // Các "chìa khóa" từ tài khoản EmailJS của bạn
    const SERVICE_ID = 'service_cmur83g';
    const TEMPLATE_ID = 'template_jvhla1o';
    const PUBLIC_KEY = 'ucjcJro8eNU36M-J4';

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then((result) => {
          console.log(result.text);
          setMessage('Yêu cầu của bạn đã được gửi thành công! Chúng tôi sẽ liên hệ lại sớm.');
          form.current.reset(); // Xóa các giá trị trong form
      }, (error) => {
          console.log(error.text);
          setMessage(`Gửi yêu cầu thất bại. Lỗi: ${error.text}. Vui lòng thử lại.`);
      })
      .finally(() => {
          setIsSending(false);
      });
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
        <p>Vui lòng điền đầy đủ thông tin và đính kèm hình ảnh theo yêu cầu bên dưới.</p>
        
        <form ref={form} onSubmit={sendEmail} className="warranty-form">
          <div className="form-group">
            <label htmlFor="name-input">Họ và tên</label>
            <input id="name-input" type="text" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="phone-input">Số điện thoại</label>
            <input id="phone-input" type="tel" name="phone" required />
          </div>
          <div className="form-group full-width">
            <label htmlFor="address-input">Địa chỉ</label>
            <input id="address-input" type="text" name="address" required />
          </div>
          <div className="form-group">
            <label htmlFor="product-select">Sản phẩm cần bảo hành</label>
            <select id="product-select" name="product" required>
              <option value="">-- Chọn sản phẩm --</option>
              {productList.map(p => (
                <option key={p.id_san_pham} value={p["Tên sản phẩm"]}>
                  {p["Tên sản phẩm"]}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="date-input">Ngày mua hàng</label>
            <input id="date-input" type="date" name="purchaseDate" required />
          </div>
          
          <div className="form-group full-width">
            <label>Hình ảnh đính kèm (tối đa 4 file)</label>
            <input type="file" name="attachment_1" accept="image/*" />
            <input type="file" name="attachment_2" accept="image/*" />
            <input type="file" name="attachment_3" accept="image/*" />
            <input type="file" name="attachment_4" accept="image/*" />
          </div>
          
          <div className="form-group full-width">
            <button type="submit" disabled={isSending}>
              {isSending ? 'Đang gửi...' : 'Gửi Yêu cầu'}
            </button>
          </div>
        </form>
        {/* Hiển thị thông báo thành công hoặc thất bại */}
        {message && <p className="form-message">{message}</p>}
      </div>
    </section>
  );
}

export default WarrantySection;