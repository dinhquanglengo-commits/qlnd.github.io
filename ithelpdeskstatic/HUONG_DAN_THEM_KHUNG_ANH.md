# Hướng dẫn Thêm Khung Upload Ảnh vào các Section mới

Tính năng upload ảnh mà mình vừa lập trình hoạt động hoàn toàn tự động. Chức năng này sẽ tự động tìm tất cả các thẻ hình ảnh (`<img>`) có trong bài viết và biến chúng thành các khung upload khi bạn ở trang `admin.html`.

Vì vậy, nếu một mục (section) hoặc một bước (step) nào đó hiện tại đang không có nút thêm hình ảnh, lý do đơn giản là vì trong code HTML của bước đó chưa có thẻ `<img>` nào.

Để thêm khung upload ảnh vào bất kỳ chỗ nào, bạn chỉ cần làm theo 2 bước cực kỳ đơn giản sau:

### Bước 1: Copy đoạn code HTML dưới đây

Bạn hãy copy đoạn code này. Đây là một thẻ hình ảnh rỗng (chưa có ảnh gốc) với độ rộng mặc định là 50%:

```html
<img style="width: 50%; height: auto;" src="">
```

*(Lưu ý: Bạn có thể đổi `50%` thành `80%` hoặc `100%` tùy ý nếu muốn ảnh hiển thị to hơn).*

### Bước 2: Dán vào phía dưới của Step bạn muốn thêm ảnh

Mở file `index.html` (và `admin.html`), tìm đến vị trí của bước mà bạn muốn có nút thêm ảnh, sau đó dán thẻ vừa copy vào ngay bên dưới `div` của bước đó.

**Ví dụ:** Bạn muốn thêm ảnh vào Mục số 6, bước số 1.

Code ban đầu của bạn sẽ trông như thế này:
```html
<div class="step">
  <div class="step-circle">1</div>
  <div class="step-content">
    <div class="step-text">Mở <b>Google Chrome</b>, truy cập địa chỉ tương ứng ở trên.</div>
  </div>
</div>
```

Bạn chỉ việc dán đoạn code thẻ `<img>` vào ngay phía dưới nó:
```html
<div class="step">
  <div class="step-circle">1</div>
  <div class="step-content">
    <div class="step-text">Mở <b>Google Chrome</b>, truy cập địa chỉ tương ứng ở trên.</div>
  </div>
</div>
<img style="width: 50%; height: auto;" src="">  <!-- CODE BẠN VỪA DÁN VÀO ĐÂY -->
```

### Cơ chế hoạt động:
- Khi trang `admin.html` load lên, code JavaScript sẽ quét thấy thẻ `<img>` này và tự động "hóa phép" nó thành giao diện gồm khung gạch đứt + nút **"📸 Thêm hình ảnh"**.
- Còn ở trang `index.html` (trang user), vì thuộc tính `src=""` là rỗng, hệ thống sẽ ẩn nó đi nên user sẽ không thấy gì cả cho đến khi bạn upload ảnh bên admin và tải file JSON lên.

Vậy là xong! Bạn không cần phải viết thêm bất kỳ dòng code JavaScript nào phức tạp, cứ ném thẻ `<img src="">` vào chỗ nào bạn muốn là nó sẽ tự có nút upload.

---

# 🚀 NHẬT KÝ NÂNG CẤP & HƯỚNG DẪN BẢO TRÌ

## 1. 📂 Hệ thống Mục lục Phân trang (Pagination)
✅ **Đã hoàn thành** — Hệ thống đã được chuyển sang dạng render tự động:

| File | Thay đổi chính |
| :--- | :--- |
| `index.html` | Xóa các ô tĩnh, thay bằng `<div id="tocGrid">` và thanh điều hướng. |
| `admin.html` | Cập nhật cấu trúc tương tự trang chủ để đồng bộ. |
| `script.js` | Thêm mảng `TOC_ITEMS` và logic render tự động ở đầu file. |
| `styles.css` | Bổ sung CSS cho thanh phân trang và các nút bấm. |

### 🎯 Cách thức hoạt động:
*   **Tự động ẩn/hiện:** Nếu danh sách có ít hơn 12 mục, thanh phân trang sẽ tự ẩn đi cho gọn.
*   **Phân trang thông minh:** Mỗi trang hiển thị 12 mục. Khi thêm mục thứ 13, trang 2 sẽ tự động được tạo.
*   **Tìm kiếm:** Khi bạn gõ vào ô tìm kiếm, hệ thống sẽ bỏ phân trang và hiện tất cả kết quả khớp từ khóa.

> [!TIP]
> **Cách thêm mục mới:** Bạn chỉ cần mở `script.js`, tìm mảng `TOC_ITEMS` ở đầu file và bỏ comment (Xóa dấu `//`) ở dòng mẫu:
> ```javascript
> // { num: 12, id: 's12', text: 'Tên mục 12 của bạn' },
> ```

---

## 2. 📸 Giải pháp Lưu trữ Ảnh dung lượng lớn
Để giải quyết triệt để lỗi **"Tràn bộ nhớ (Quota Exceeded)"** và hỗ trợ chạy offline qua giao thức `file://`, hệ thống đã được nâng cấp logic lưu trữ:

### 🛠️ Các cải tiến chính:
1.  **Chuyển sang `data.js`:** Thay vì dùng file `.json` (bị trình duyệt chặn khi chạy offline), dữ liệu được lưu vào file `.js` để có thể load trực tiếp ở bất cứ đâu.
2.  **Lưu trữ Delta (Chênh lệch):** Trình duyệt không còn lưu toàn bộ 8MB vào `localStorage` nữa. Nó chỉ lưu những ảnh bạn **vừa mới thêm hoặc sửa**.
3.  **Tải ưu tiên:** Code luôn ưu tiên đọc dữ liệu "gốc" từ file `data.js` trước, sau đó mới đè các thay đổi tạm thời từ máy bạn lên trên.

### 🚀 Quy trình cập nhật nội dung chuẩn (MỚI):

1.  **Thêm nội dung:** Mở `admin.html`, thêm/sửa ảnh bình thường.
2.  **Xuất dữ liệu:** Bấm nút **"💾 Tải xuống JSON"** để tải về file `data.js` mới nhất.
3.  **Cập nhật Source:** Chép đè file `data.js` vừa tải vào thư mục mã nguồn của bạn.
4.  **Tối ưu hóa (QUAN TRỌNG):** Mở PowerShell tại thư mục mã nguồn và chạy script `.\extract_images.ps1`. Script này sẽ tự động tách các ảnh mới ra thành file `.jpg/.png` vào thư mục `images/` và thu gọn `data.js` xuống còn 1-2KB.
5.  **Dọn dẹp (Tùy chọn):** Nhấn **"🗑️ Xóa dữ liệu tạm"** trên web Admin để làm sạch trình duyệt.
6.  **Đưa lên GitHub:** Push toàn bộ thư mục (kèm `data.js` nhẹ và các ảnh mới) lên GitHub.
---

## 3. ⚡ Sửa lỗi Bất đồng bộ (Async Loading Fix)
*   **Vấn đề:** Trước đây giao diện Admin đôi khi bị trống do vẽ khung ảnh trước khi dữ liệu kịp tải xong.
*   **Giải pháp:** Đã cập nhật `script.js` để bắt hệ thống đợi `data.js` nạp xong hoàn toàn mới bắt đầu khởi tạo giao diện Admin.
*   **Kết quả:** Khung ảnh và nút "Đổi ảnh khác" sẽ luôn hiện ra đầy đủ và chính xác.
