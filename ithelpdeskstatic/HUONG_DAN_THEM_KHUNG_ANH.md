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

////pagination
✅ Đã implement xong — 4 chỗ chỉnh sửa:
File	Thay đổi
index.html	Xóa 11 ô toc-item tĩnh → thay bằng <div id="tocGrid"> rỗng + thanh pagination ← →
admin.html	Tương tự như index.html
script.js	Thêm vào đầu file: mảng TOC_ITEMS, hàm renderTocPage(), changeTocPage(), và gọi renderTocPage() trong window.load
styles.css	Thêm CSS cho .toc-pagination và .toc-page-btn vào cuối file
🎯 Cách hoạt động:
Hiện tại 11 mục → chỉ 1 trang → nút ← → ẩn đi (không lộm cộm)
Khi thêm mục 12 trở lên (≥ 11 mục) → thanh ← → tự động hiện chia trang 10 mục/trang
Khi search → tự động bỏ pagination, hiển thị tất cả mục khớp từ khóa trên toàn bộ danh sách
📝 Khi thêm mục mới, chỉ cần uncommment và sửa dòng này trong script.js:
js
// { num: 12, id: 's12', text: 'Tên mục 12 của bạn' },