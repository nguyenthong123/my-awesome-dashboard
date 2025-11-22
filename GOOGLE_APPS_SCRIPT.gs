/**
 * Google Apps Script for Dashboard Warranty Form
 * Deploy as Web App:
 * 1. Copy code below
 * 2. Go to: https://script.google.com
 * 3. Create new project → paste code
 * 4. Save & Deploy → New deployment → Web app
 *    - Execute as: Your account
 *    - Who has access: Anyone
 * 5. Copy deployment URL and paste in React form as APPS_SCRIPT_URL
 */

// Configuration
const SPREADSHEET_ID = '1xJ0V9adaKeF8fCCrv12g764HPfvJNER4Fn9tgfgLP6U';
const SHEET_NAME = 'bao_hanh';
const DRIVE_FOLDER_ID = '1_ZZuREc6D0ydhDuDhAzrY9KqZspYKr4Y'; // Nơi lưu ảnh
const MAX_FILE_SIZE = 5242880; // 5MB

/**
 * Main doPost handler to receive warranty form data
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!payload.name || !payload.phone || !payload.product) {
      return buildErrorResponse('Thiếu thông tin bắt buộc');
    }

    // Process images
    const imageUrls = [];
    if (payload.images && Array.isArray(payload.images)) {
      for (const imageData of payload.images) {
        try {
          const imageUrl = saveImageToDrive(imageData);
          if (imageUrl) {
            imageUrls.push(imageUrl);
          }
        } catch (imgError) {
          Logger.log('Image upload error: ' + imgError);
          // Continue processing even if one image fails
        }
      }
    }

    // Add data to Sheet
    const result = addWarrantyToSheet({
      name: payload.name,
      phone: payload.phone,
      address: payload.address || '',
      product: payload.product,
      purchaseDate: payload.purchaseDate || '',
      description: payload.description || '',
      store: payload.store || '',
      latitude: payload.latitude || '',
      longitude: payload.longitude || '',
      imageUrls: imageUrls.join(' | '),
      timestamp: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
    });

    return buildSuccessResponse('Yêu cầu của bạn đã được lưu thành công!');
  } catch (error) {
    Logger.log('Error in doPost: ' + error);
    return buildErrorResponse('Lỗi hệ thống: ' + error.message);
  }
}

/**
 * Save image to Google Drive
 */
function saveImageToDrive(imageData) {
  try {
    // imageData should be: { name: 'filename', data: 'base64_string' }
    const blob = Utilities.newBlob(
      Utilities.base64Decode(imageData.data),
      imageData.mimeType || 'image/jpeg',
      imageData.name
    );

    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const file = folder.createFile(blob);
    
    // Make file public (viewable)
    file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
    
    return file.getUrl();
  } catch (error) {
    Logger.log('Image save error: ' + error);
    throw error;
  }
}

/**
 * Add warranty record to Google Sheet
 */
function addWarrantyToSheet(data) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error(`Sheet "${SHEET_NAME}" not found`);
    }

    // Ensure header row exists
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Thời gian',
        'Họ tên',
        'Điện thoại',
        'Địa chỉ',
        'Cửa hàng',
        'Sản phẩm',
        'Ngày mua',
        'Mô tả lỗi',
        'Vị trí (Lat)',
        'Vị trí (Lng)',
        'Hình ảnh'
      ]);
    }

    // Add data row
    sheet.appendRow([
      data.timestamp,
      data.name,
      data.phone,
      data.address,
      data.store,
      data.product,
      data.purchaseDate,
      data.description,
      data.latitude,
      data.longitude,
      data.imageUrls
    ]);

    return { success: true };
  } catch (error) {
    Logger.log('Sheet error: ' + error);
    throw error;
  }
}

/**
 * Helper: build success response
 */
function buildSuccessResponse(message) {
  return ContentService.createTextOutput(
    JSON.stringify({ success: true, message: message })
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper: build error response
 */
function buildErrorResponse(message) {
  return ContentService.createTextOutput(
    JSON.stringify({ success: false, message: message })
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function to check Sheet exists
 */
function testSheet() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (sheet) {
      Logger.log('Sheet found: ' + SHEET_NAME);
    } else {
      Logger.log('Sheet NOT found: ' + SHEET_NAME);
    }
  } catch (error) {
    Logger.log('Error: ' + error);
  }
}
