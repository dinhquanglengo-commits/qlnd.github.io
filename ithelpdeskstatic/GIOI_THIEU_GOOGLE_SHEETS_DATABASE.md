# 🚀 GIẢI PHÁP "BÌNH DÂN": DÙNG GOOGLE SHEETS LÀM DATABASE CHO WEB TĨNH

Khi bạn có một trang web tĩnh (Static Web) chạy trên GitHub Pages, nhược điểm lớn nhất là không có máy chủ (Backend/Server) để xử lý dữ liệu và Database để lưu trữ nhiều người cùng lúc. 

Thay vì phải tốn tiền thuê Server hay học các công nghệ Database phức tạp (SQL, MongoDB...), có một giải pháp "hack" cực kỳ thông minh và phổ biến trong cộng đồng lập trình: **Dùng Google Sheets (Excel của Google) làm Database.**

---

## 1. Cơ chế hoạt động như thế nào?

Bạn sẽ kết hợp 2 dịch vụ miễn phí của Google:
1. **Google Sheets:** Đóng vai trò là cái Database (Nơi lưu trữ dữ liệu). Mỗi cột là một trường dữ liệu (ID, Image_Base64, Title...), mỗi hàng là một bản ghi.
2. **Google Apps Script (GAS):** Đóng vai trò là cái Máy chủ (Backend Server). Khá giống JavaScript, GAS có thể đọc/ghi dữ liệu vào Google Sheets và mở ra một đường dẫn mạng (API Endpoint) để trang web của bạn có thể gọi tới.

**Luồng chạy thực tế:**
- **Khi hiển thị Web (Trang User):** Web dùng Javascript (`fetch`) gọi đến API của Google Apps Script. GAS đọc Google Sheet và trả về dữ liệu (dạng JSON). Trình duyệt nhận JSON và vẽ ảnh lên màn hình.
- **Khi thêm ảnh (Trang Admin):** Admin upload ảnh. Web dùng Javascript gửi dữ liệu Base64 của ảnh đó lên API của GAS qua phương thức `POST`. GAS nhận dữ liệu và điền thêm một dòng mới vào Google Sheet.

---

## 2. Tại sao nó giải quyết được lỗi 2 Admin cùng làm (Race Condition)?

Bởi vì Google Sheets sinh ra để **làm việc nhóm thời gian thực (Real-time Collaboration)**! 
- Google có những thuật toán siêu việt để quản lý việc nhiều người cùng sửa một file Excel cùng một lúc (Concurrency Control). 
- Khi Admin A và Admin B cùng bấm "Lưu ảnh" ở 2 nơi khác nhau, cả 2 yêu cầu sẽ bay về Google Apps Script. Hệ thống của Google sẽ tự động xếp hàng chúng lại và ghi vào Google Sheet thành 2 dòng riêng biệt một cách an toàn, không ai đè lên ai.

---

## 3. Ưu và Nhược điểm của giải pháp này

### Ưu điểm (Pros):
- **Hoàn toàn MIỄN PHÍ:** Bạn không tốn một đồng nào tiền duy trì Server hay Database.
- **Dễ quản lý:** Dữ liệu nằm trong Google Sheet, bạn có thể mở lên xem, sửa bằng tay, xóa hoặc lọc dữ liệu y như xài Excel bình thường cực kỳ trực quan.
- **Không cần cài đặt rườm rà:** Chỉ cần tài khoản Google là đủ.
- **Có sẵn API:** Google Apps Script hỗ trợ xuất API Web App rất dễ.

### Nhược điểm (Cons):
- **Bảo mật kém:** Phù hợp với dữ liệu nội bộ/dữ liệu không nhạy cảm. Vì Web tĩnh gọi thẳng API, ai biết devtool đều có thể xem được URL API. 
- **Giới hạn tốc độ:** API của Google Apps Script khá chậm (mất khoảng 1-2 giây để phản hồi). Không phù hợp cho ứng dụng cần realtime (tốc độ cao).
- **Giới hạn kích thước:** Google Sheets có giới hạn số lượng ô (cell) và giới hạn độ dài ký tự trong 1 ô (50,000 ký tự). Ảnh Base64 có thể rất dài, nếu ảnh chất lượng cao sẽ vượt giới hạn 50k ký tự/ô của Google Sheet. Do đó, thường phải kết hợp lưu ảnh gốc lên **Google Drive**, lấy cái Link ảnh lưu vào Google Sheet.

---

## 4. Các bước triển khai cơ bản (Overview)

Nếu sau này bạn muốn làm thử, quy trình thường có 4 bước:

1. **Tạo Google Sheet:** 
   - Tạo 1 file Sheet mới (ví dụ tên `IT_Helpdesk_DB`).
   - Đặt tên các cột ở dòng 1: `ID`, `Image_URL`, `CreatedAt`...
2. **Viết code Google Apps Script:**
   - Trong Sheet, vào *Tiện ích mở rộng > Apps Script*.
   - Viết các hàm `doGet(e)` (để Web lấy dữ liệu) và `doPost(e)` (để Web lưu dữ liệu).
3. **Deploy (Triển khai) API:**
   - Chọn *Triển khai > Giao diện web*.
   - Quyền truy cập: "Bất kỳ ai". 
   - Lấy URL được cung cấp. URL này chính là API.
4. **Viết code JavaScript trên Web:**
   - Trong file `script.js`, thay vì `fetch('data.json')`, bạn sẽ đổi thành `fetch('URL_CỦA_GOOGLE_SCRIPT')`.

> **Mẹo nâng cao:** 
> Vì ảnh Base64 chuỗi văn bản rất dài và dễ làm sập Google Sheet, quy trình tối ưu là: Web sẽ đẩy file ảnh thẳng lên Google Drive thông qua API. Google Drive trả về 1 cái "Link xem ảnh". Gửi cái Link đó lưu vào Google Sheet. Web tải Google Sheet về chỉ việc ném cái Link đó vào thuộc tính `<img src="LINK">` là xong! Nhanh và siêu nhẹ!

Đây là một "Stack" công nghệ rất thú vị và thực dụng cho các hệ thống nhỏ nội bộ. Nếu có dự án nào phù hợp, bạn có thể tự mình thử nghiệm nhé!
