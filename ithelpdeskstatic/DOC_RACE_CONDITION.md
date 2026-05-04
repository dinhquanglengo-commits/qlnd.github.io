# BÀI HỌC KINH NGHIỆM: RACE CONDITION & ASYNC/SYNC TRONG JAVASCRIPT

Dưới đây là tài liệu giải thích chi tiết về lỗi mất hình trên trang Admin mà chúng ta vừa gặp phải, nguyên nhân sâu xa và cách giải quyết. Bạn có thể lưu lại để áp dụng cho các dự án Web sau này.

---

## 1. Hiện tượng lỗi (Symptom)
- **Trang User (`index.html`):** Hình ảnh load bình thường từ file `data.json`.
- **Trang Admin (`admin.html`):** Giao diện khung thêm/sửa ảnh xuất hiện nhưng lại **hiển thị trạng thái trống** (không load được ảnh cũ lên để sửa), mặc dù dữ liệu trong `data.json` đã có.

## 2. Tên gọi kỹ thuật của vấn đề
Trong lập trình, lỗi này được gọi là **Race Condition** (Tình trạng tương tranh) kết hợp với **Bất đồng bộ (Asynchronous)**.

Nó xảy ra khi bạn có 2 đoạn code:
- **Tiến trình A:** Đi tải dữ liệu từ mạng về (mất thời gian).
- **Tiến trình B:** Vẽ giao diện UI dựa trên dữ liệu đó (rất nhanh).

Do không có sự ràng buộc, **Tiến trình B** chạy xong trước khi **Tiến trình A** kịp mang dữ liệu về. Hậu quả là UI vẽ lên với dữ liệu rỗng.

## 3. Phân tích nguyên nhân sâu xa (Root Cause)

Trước đây, khi dùng `localStorage`, việc đọc dữ liệu là **Đồng bộ (Synchronous)**. Tức là CPU đọc data trực tiếp từ RAM máy tính, nó xảy ra ngay lập tức:
```javascript
// CÁCH CŨ (Đồng bộ - Nhanh như chớp)
const localData = localStorage.getItem('helpdesk_images'); // Lấy data ngay lập tức
Object.assign(imageStates, parsed); // Đổ data vào biến
initImageUploads(); // Vẽ giao diện Admin (Giao diện nhận được data ngay)
```

Tuy nhiên, khi chúng ta chuyển sang dùng file `data.json`, việc đọc dữ liệu trở thành **Bất đồng bộ (Asynchronous)** qua lệnh `fetch()`:
```javascript
// CÁCH MỚI (Bất đồng bộ - Tốn thời gian chờ mạng)
fetch('data.json').then(data => {
    Object.assign(imageStates, data); // (A) Phải chờ 0.1s - 1s mới có data
});

initImageUploads(); // (B) Trình duyệt chạy dòng này NGAY LẬP TỨC không thèm chờ (A)
```
=> **Hệ quả:** Hàm `initImageUploads()` vẽ khung ảnh ra, nó nhìn vào biến `imageStates` thấy đang trống trơn (vì lệnh fetch chưa tải xong), nên nó render ra khung ảnh trống. Khoảng 0.5 giây sau, lệnh `fetch` tải xong, đổ data vào `imageStates` nhưng lúc này giao diện Admin đã vẽ xong rồi, nó không tự cập nhật lại nữa.

## 4. Cách khắc phục (Solution)

Nguyên lý giải quyết rất đơn giản: **Bắt giao diện phải chờ dữ liệu tải xong rồi mới được phép vẽ.**

Trong Javascript, chúng ta dùng `Promise` (.then) hoặc `async/await` để bắt mã code xếp hàng chạy theo thứ tự.

**Cách sửa code thực tế:**
Thay vì gọi 2 hàm độc lập, ta đưa hàm vẽ giao diện vào bên trong khối lệnh `.then()` của hàm tải dữ liệu:

**Code lỗi:**
```javascript
window.addEventListener('load', () => {
    loadSavedImages(); // Hàm fetch chạy ngầm (Bất đồng bộ)
    initImageUploads(); // Vẽ giao diện ngay lập tức (LỖI)
});
```

**Code chuẩn:**
```javascript
// Sửa hàm loadSavedImages trả về một Lời hứa (Promise)
function loadSavedImages() {
    return fetch('data.json').then(...) 
}

window.addEventListener('load', () => {
    // Chờ loadSavedImages() làm xong nhiệm vụ (tải qua mạng xong)...
    loadSavedImages().then(() => {
        // ... THÌ MỚI (.then) chạy hàm vẽ giao diện
        initImageUploads(); 
    });
});
```

## 5. Bài học rút ra (Best Practices)
Khi làm các dự án Web khác, hãy luôn nhớ:
1. **Bất cứ hàm nào gọi API, đọc file từ server (`fetch`, `axios`, `XMLHttpRequest`)** đều là tác vụ **Bất đồng bộ (Asynchronous)**.
2. Không bao giờ viết code vẽ UI (User Interface) ngay bên dưới lệnh fetch mà mong đợi nó có data liền.
3. Luôn bọc code khởi tạo UI vào `.then()` hoặc đặt sau lệnh `await`.
4. Nếu UI của bạn có lúc hiện đúng, có lúc hiện sai (tùy thuộc vào mạng nhanh hay chậm), 99% nguyên nhân là do lỗi **Race Condition**.
