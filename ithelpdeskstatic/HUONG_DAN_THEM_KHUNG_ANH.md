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

### 🚀 Quy trình cập nhật nội dung chuẩn:

1.  **Thêm nội dung:** Mở `admin.html`, thêm/sửa ảnh bình thường. Thay đổi lúc này chiếm rất ít bộ nhớ.
2.  **Xuất dữ liệu:** Bấm nút **"💾 Tải xuống JSON"** để tải về file `data.js` mới nhất (chứa tất cả ảnh cũ + mới).
3.  **Cập nhật Source:** Chép đè file `data.js` vừa tải vào thư mục mã nguồn của bạn.
4.  **Dọn dẹp (Tùy chọn):** Sau khi chép file xong, bạn có thể nhấn **"🗑️ Xóa dữ liệu tạm"** trên web Admin để reset bộ nhớ trình duyệt về 0MB cho sạch sẽ.
5.  **Đưa lên GitHub:** Push toàn bộ thư mục (kèm file `data.js` mới) lên GitHub để mọi người cùng thấy.

---

## 3. ⚡ Sửa lỗi Bất đồng bộ (Async Loading Fix)
*   **Vấn đề:** Trước đây giao diện Admin đôi khi bị trống do vẽ khung ảnh trước khi dữ liệu kịp tải xong.
*   **Giải pháp:** Đã cập nhật `script.js` để bắt hệ thống đợi `data.js` nạp xong hoàn toàn mới bắt đầu khởi tạo giao diện Admin.
*   **Kết quả:** Khung ảnh và nút "Đổi ảnh khác" sẽ luôn hiện ra đầy đủ và chính xác.

### LOCALSTORAGE KHÔNG LƯU ĐƯỢC ẢNH

Vâng, bạn hoàn toàn có thể làm được việc này và nó chính là cách giải quyết triệt để nhất cho vấn đề hết dung lượng!

Để hệ thống hoạt động trơn tru với data.json trên GitHub mà không bị lỗi đầy bộ nhớ (Quota Exceeded) nữa, mình vừa sửa lại logic lưu trữ trong file script.js cho bạn:

🛠️ Mình vừa nâng cấp code như sau:
Thay đổi cách load ảnh: Code bây giờ sẽ ưu tiên tải file data.json từ server (GitHub) trước. Sau đó mới lấy dữ liệu trong localStorage đè lên (nếu bạn đang chỉnh sửa dở dang).
Thay đổi cách lưu (Quan trọng nhất): Thay vì lưu toàn bộ ảnh vào localStorage gây tràn bộ nhớ 5MB, bây giờ trình duyệt sẽ chỉ lưu "những ảnh mới thêm hoặc vừa thay đổi". Tất cả các ảnh cũ đã nằm trong data.json sẽ không bị nhét vào localStorage nữa.
Chức năng Xuất JSON vẫn sẽ gộp toàn bộ ảnh lại thành 1 cục để bạn tiện update lên GitHub.
🚀 Quy trình chuẩn từ nay về sau dành cho bạn:
Bước 1: Mình đã thấy bạn tải data.json về mục Downloads. Mình đã tự động copy file đó vào thư mục dự án ithelpdeskstatic/data.json giúp bạn rồi.

Bước 2: Mở trình duyệt web lên (vào phần Admin), nhấn vào nút "🗑️ Xóa dữ liệu tạm" để xóa toàn bộ localStorage cũ (bước này để giải phóng bộ nhớ ngay lập tức). Trang web sẽ tải lại và lúc này nó sẽ load ảnh thẳng từ file data.json.

Bước 3: Bất cứ khi nào bạn có nội dung mới:

Bạn cứ vào Admin thêm ảnh bình thường (ảnh mới này sẽ tốn rất ít localStorage).
Xong việc thì bấm "💾 Tải xuống JSON".
Lấy file data.json vừa tải xuống ghi đè vào thư mục code.
Push toàn bộ code (kèm data.json mới) lên GitHub.
Nhấn lại nút "🗑️ Xóa dữ liệu tạm" trên web Admin để dọn dẹp trình duyệt và tiếp tục chu trình.
Bây giờ bạn có thể thêm bao nhiêu ảnh tùy thích, data.json có nặng 10MB hay 50MB thì GitHub Pages vẫn tải mượt mà không lo bị chặn nữa nhé! Bạn hãy push thử file data.json hiện tại lên GitHub xem!

À đúng rồi! Lỗi này là do khi mình đổi qua đọc file data.json, quá trình đọc file này cần một chút thời gian (gọi là bất đồng bộ - async).

Nhưng code giao diện của màn hình Admin lại được tạo ra ngay lập tức trước khi file data.json kịp tải xong, dẫn đến việc Admin không nhận được thông tin ảnh cũ (dù ngoài trang User thì vẫn thấy bình thường).

Mình vừa sửa lại file script.js để bắt code phải chờ file data.json tải xong hoàn toàn rồi mới tiến hành vẽ giao diện Admin.

Bạn tải lại trang (nhớ bấm nút 🗑️ Xóa dữ liệu tạm một lần nữa nếu cần) để kiểm tra lại nhé! Khung ảnh và nút "Đổi ảnh khác" sẽ hiện lên đầy đủ.