# 📖 Hướng Dẫn Tự Chỉnh Sửa Trang Web IT Helpdesk Portal

> Tài liệu dành cho người quản trị trang. Đọc một lần, sửa mãi mãi — không cần hỏi AI.

---

## 🗂️ Cấu Trúc File Dự Án

```
ithelpdeskstatic/
├── index.html      ← Trang người dùng xem (KHÔNG có nút admin)
├── admin.html      ← Trang quản trị (upload ảnh, giống hệt index.html nhưng có thêm tools)
├── script.js       ← Logic JavaScript dùng chung cho cả 2 trang
├── styles.css      ← Toàn bộ CSS của trang
├── data.json       ← File chứa ảnh đã upload (xuất từ admin, push lên GitHub)
└── backup/         ← Thư mục backup, luôn giữ bản cũ ở đây
```

> [!IMPORTANT]
> **Mỗi khi sửa `index.html`, BẮT BUỘC phải sửa `admin.html` với nội dung tương tự.**
> Hai file này giống nhau về HTML, khác nhau ở phần tiêu đề và đường dẫn script.

---

## 🧩 Giải Thích Cấu Trúc HTML

### Khung tổng thể của một mục hướng dẫn

```
div.guide-wrap
├── div.guide-header        ← Banner tiêu đề xanh ở trên cùng
├── div.toc-panel           ← Bảng mục lục (lưới 2 cột)
│   └── div.toc-grid
│       ├── div.toc-item    ← Mỗi ô trong mục lục
│       └── ...
├── div.section#sec-s1      ← Section hướng dẫn 1
├── div.section#sec-s2      ← Section hướng dẫn 2
└── ...
```

### Cấu trúc của mỗi `div.section`

```html
<div class="section" id="sec-s12">          ← ID phải khớp với toggle('s12')
  <div class="section-header" onclick="toggle('s12')">
    <div class="section-num">12</div>        ← Số thứ tự
    <div class="section-title">Tên mục</div> ← Tiêu đề
    <div class="section-tags">              ← Các nhãn tag (iOS, PC, Mobile...)
      <span class="tag tag-pc">PC</span>
    </div>
    <span class="chevron" id="chev-s12">▶</span>  ← Mũi tên xoay khi mở
  </div>
  <div class="section-body" id="body-s12"> ← Nội dung bên trong
    ...
  </div>
</div>
```

---

## ➕ Thêm Mục Mới Vào Mục Lục (Ví dụ: Mục 12)

### Bước 1 — Thêm ô vào mục lục (`toc-grid`)

Tìm đoạn sau trong `index.html` (và `admin.html`):

```html
      <div class="toc-item" onclick="toggle('s11')">
        <div class="toc-num">11</div>
        <div class="toc-text">Kết nối họp UCKC tại TTĐĐK</div>
      </div>
      <div class="toc-item" style="background:transparent;cursor:default;"></div>  ← ĐÂY LÀ Ô TRỐNG
    </div>
```

**Thay thế ô trống** thành mục 12 của bạn:

```html
      <div class="toc-item" onclick="toggle('s11')">
        <div class="toc-num">11</div>
        <div class="toc-text">Kết nối họp UCKC tại TTĐĐK</div>
      </div>
      <div class="toc-item" onclick="toggle('s12')">
        <div class="toc-num">12</div>
        <div class="toc-text">TÊN MỤC 12 CỦA BẠN</div>
      </div>
    </div>
```

> [!NOTE]
> Mục lục dùng lưới 2 cột. Khi số mục là **số lẻ** (11 mục → ô 12 trống), hệ thống tự fill ô trống vào cột phải.  
> Khi bạn thêm mục 12 → tổng là 12 = số chẵn → **không cần ô trống nữa**.  
> Khi thêm mục 13 → lại cần thêm ô trống như cũ.

---

### 🔄 Xử Lý Pagination Arrow Cho Mục Lục (Khi Mục Lục Quá Dài)

Khi số mục quá nhiều (ví dụ: từ 12 mục trở lên), bạn muốn mục lục có **nút ← →** để chuyển trang thay vì cuộn dài. Đây là cách làm:

#### Bước 1 — Thay thế `div.toc-grid` thành dạng có pagination

Trong `index.html` và `admin.html`, tìm dòng `<div class="toc-grid">` và thay toàn bộ khối `toc-grid` bằng đoạn sau:

```html
<!-- Pagination controls -->
<div class="toc-pagination" id="tocPagination">
  <button class="toc-page-btn" id="tocPrevBtn" onclick="changeTocPage(-1)">&#8592;</button>
  <span id="tocPageInfo">Trang 1 / 2</span>
  <button class="toc-page-btn" id="tocNextBtn" onclick="changeTocPage(1)">&#8594;</button>
</div>

<div class="toc-grid" id="tocGrid">
  <!-- Các toc-item sẽ được điền tự động bởi JS (xem Bước 2) -->
</div>
```

#### Bước 2 — Thêm dữ liệu mục lục vào `script.js`

Mở `script.js`, thêm đoạn code sau vào **đầu file** (trước hàm `toggleAccordion`):

```javascript
// ==========================================
// PAGINATION MỤC LỤC
// ==========================================
const TOC_ITEMS = [
  { num: 1,  id: 's1',  text: 'Kết nối WiFi (iOS & Android)' },
  { num: 2,  id: 's2',  text: 'Kết nối VPN Global' },
  { num: 3,  id: 's3',  text: 'Cài đặt lại MFA (QR Code)' },
  { num: 4,  id: 's4',  text: 'Cài đặt ứng dụng PVGAS' },
  { num: 5,  id: 's5',  text: 'Cài đặt Microsoft Teams' },
  { num: 6,  id: 's6',  text: 'Đăng nhập ngoài công ty' },
  { num: 7,  id: 's7',  text: 'Archive email & kiểm tra mail' },
  { num: 8,  id: 's8',  text: 'Thiết bị phòng họp (Polycom)' },
  { num: 9,  id: 's9',  text: 'Tạo lịch họp Teams' },
  { num: 10, id: 's10', text: 'Kiểm tra bộ gõ tiếng Việt' },
  { num: 11, id: 's11', text: 'Kết nối họp UCKC tại TTĐĐK' },
  { num: 12, id: 's12', text: 'TÊN MỤC 12 CỦA BẠN' },
  // Thêm mục mới vào đây theo cùng cú pháp:
  // { num: 13, id: 's13', text: 'Tên mục 13' },
];
const TOC_PER_PAGE = 10; // Mỗi trang hiển thị 10 mục (5 hàng × 2 cột)
let tocCurrentPage = 0;

function renderTocPage() {
  const grid = document.getElementById('tocGrid');
  if (!grid) return;

  const start = tocCurrentPage * TOC_PER_PAGE;
  const pageItems = TOC_ITEMS.slice(start, start + TOC_PER_PAGE);

  // Xây HTML
  grid.innerHTML = pageItems.map(item => `
    <div class="toc-item" onclick="toggle('${item.id}')">
      <div class="toc-num">${item.num}</div>
      <div class="toc-text">${item.text}</div>
    </div>
  `).join('');

  // Nếu lẻ ô, thêm ô trống để giữ layout 2 cột
  if (pageItems.length % 2 !== 0) {
    grid.innerHTML += '<div class="toc-item" style="background:transparent;cursor:default;"></div>';
  }

  // Cập nhật thông tin trang
  const totalPages = Math.ceil(TOC_ITEMS.length / TOC_PER_PAGE);
  const pageInfo = document.getElementById('tocPageInfo');
  const prevBtn = document.getElementById('tocPrevBtn');
  const nextBtn = document.getElementById('tocNextBtn');

  if (pageInfo) pageInfo.textContent = `Trang ${tocCurrentPage + 1} / ${totalPages}`;
  if (prevBtn) prevBtn.disabled = tocCurrentPage === 0;
  if (nextBtn) nextBtn.disabled = tocCurrentPage >= totalPages - 1;

  // Ẩn pagination nếu chỉ có 1 trang
  const pagination = document.getElementById('tocPagination');
  if (pagination) pagination.style.display = totalPages <= 1 ? 'none' : 'flex';
}

function changeTocPage(direction) {
  const totalPages = Math.ceil(TOC_ITEMS.length / TOC_PER_PAGE);
  tocCurrentPage = Math.max(0, Math.min(tocCurrentPage + direction, totalPages - 1));
  renderTocPage();
}
```

#### Bước 3 — Thêm CSS cho pagination vào `styles.css`

Mở `styles.css`, thêm đoạn sau vào **cuối file**:

```css
/* --- Pagination Mục Lục --- */
.toc-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 10px 20px;
  border-top: 1px solid var(--border);
  background: var(--step-bg);
  font-size: 13px;
  color: var(--text-muted);
}

.toc-page-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--blue);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, border-color 0.2s;
}

.toc-page-btn:hover:not(:disabled) {
  background: var(--blue-light);
  border-color: var(--blue);
}

.toc-page-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
```

#### Bước 4 — Gọi hàm render khi trang load

Trong `script.js`, tìm đoạn này trong `window.addEventListener('load', ...)`:

```javascript
window.addEventListener('load', () => {
    updateLoading();
    initDarkMode();
    loadSavedImages();
    ...
```

Thêm `renderTocPage();` vào ngay sau `initDarkMode();`:

```javascript
window.addEventListener('load', () => {
    updateLoading();
    initDarkMode();
    renderTocPage(); // ← THÊM DÒNG NÀY
    loadSavedImages();
    ...
```

> [!TIP]
> Sau khi bật pagination, **mỗi lần thêm mục mới**, bạn chỉ cần thêm 1 dòng vào mảng `TOC_ITEMS` trong `script.js`. Không cần đụng vào HTML nữa!

---

## ➕ Thêm Section Hướng Dẫn Mới (Ví dụ: Mục 12)

Sau khi đã thêm ô vào mục lục, thêm tiếp **nội dung section** vào file HTML.

Tìm section cuối cùng (section 11) và dán đoạn code sau **ngay bên dưới** thẻ `</div>` đóng của section đó:

```html
  <!-- Section 12 -->
  <div class="section" id="sec-s12">
    <div class="section-header" onclick="toggle('s12')">
      <div class="section-num">12</div>
      <div class="section-title">TÊN MỤC 12 CỦA BẠN</div>
      <div class="section-tags"><span class="tag tag-pc">PC</span></div>
      <span class="chevron" id="chev-s12">▶</span>
    </div>
    <div class="section-body" id="body-s12">
      <div class="desc-box">Mô tả ngắn về mục này.</div>
      <div class="steps-label">Các bước thực hiện</div>

      <div class="step">
        <div class="step-circle">1</div>
        <div class="step-content">
          <div class="step-text">Nội dung bước 1.</div>
        </div>
      </div>
      <img style="width: 50%; height: auto;" src="">

      <div class="step">
        <div class="step-circle">2</div>
        <div class="step-content">
          <div class="step-text">Nội dung bước 2.</div>
        </div>
      </div>

    </div>
  </div>
```

> [!IMPORTANT]
> Nhớ dán đoạn này vào **cả `index.html` lẫn `admin.html`**.

---

## 🏷️ Các Loại Tag Sẵn Có

| Class | Màu | Dùng khi |
|-------|-----|---------|
| `tag-ios` | Xanh dương nhạt | Hướng dẫn cho iPhone/iPad |
| `tag-android` | Xanh lá nhạt | Hướng dẫn cho Android |
| `tag-pc` | Tím nhạt | Hướng dẫn cho máy tính |
| `tag-mobile` | Vàng nhạt | Hướng dẫn chung cho điện thoại |

**Cách dùng nhiều tag cùng lúc:**
```html
<div class="section-tags">
  <span class="tag tag-ios">iOS</span>
  <span class="tag tag-android">Android</span>
  <span class="tag tag-pc">PC</span>
</div>
```

---

## 📦 Các Component Nội Dung Trong Section

### Hộp mô tả (màu xanh nhạt)
```html
<div class="desc-box">Mô tả ngắn gọn về mục hướng dẫn này.</div>
```

### Nhãn tiêu đề nhóm bước
```html
<div class="steps-label">Các bước thực hiện</div>
```

### Bước hướng dẫn (step)
```html
<div class="step">
  <div class="step-circle">1</div>
  <div class="step-content">
    <div class="step-text">Nội dung bước. Dùng <b>thẻ b</b> để in đậm.</div>
  </div>
</div>
```

### Bước có danh sách con (bullet points)
```html
<div class="step">
  <div class="step-circle">3</div>
  <div class="step-content">
    <div class="step-text">Điền đầy đủ thông tin:</div>
    <div class="step-sub">
      <div class="sub-item">
        <div class="sub-dot"></div><span>Tiêu đề cuộc họp</span>
      </div>
      <div class="sub-item">
        <div class="sub-dot"></div><span><b>Ngày, giờ</b> bắt đầu và kết thúc</span>
      </div>
    </div>
  </div>
</div>
```

### Nhóm phụ (subsection — có tiêu đề vàng)
```html
<div class="subsection">
  <div class="subsection-title">A — Cài đặt trên điện thoại</div>
  <!-- Các step bên trong -->
</div>

<div class="subsection">
  <div class="subsection-title">B — Cài đặt trên máy tính</div>
  <!-- Các step bên trong -->
</div>
```

### Hộp ghi chú (màu vàng nhạt)
```html
<div class="note">✅ Hoàn tất — có thể bắt đầu sử dụng.</div>
```

### Chip URL / đường dẫn
```html
<div class="url-list">
  <span class="url-chip">🔗 qlcv.pvgas.com.vn — Quản lý công việc</span>
  <span class="url-chip">🔗 mail.pvgas.com.vn — Hệ thống Mail</span>
</div>
```

### Bước cảnh báo / lưu ý (dùng dấu !)
```html
<div class="step">
  <div class="step-circle">!</div>
  <div class="step-content">
    <div class="step-text">Lưu ý quan trọng cần chú ý.</div>
  </div>
</div>
```

### Ảnh đơn
```html
<img style="width: 50%; height: auto;" src="">
<!-- Để src="" nếu dùng admin để upload sau -->
<!-- Thay bằng src="images/tenfile.jpg" nếu upload ảnh thủ công -->
```

### Hai ảnh song song (cạnh nhau)
```html
<div class="flex gap-4">
  <img class="w-1/2 h-auto object-cover rounded" src="images/anh1.jpg">
  <img class="w-1/2 h-auto object-cover rounded" src="images/anh2.jpg">
</div>
```

### Khoảng trống cuối section
```html
<div style="height:10px;"></div>
```

---

## 🔢 Cập Nhật Số Đếm Mục Trong Banner Header

Khi thêm mục mới, nhớ cập nhật số đếm ở banner:

Tìm dòng:
```html
<div class="meta-item">
  <div class="meta-icon">📋</div>11 hướng dẫn
</div>
```

Đổi thành (ví dụ khi có 12 mục):
```html
<div class="meta-item">
  <div class="meta-icon">📋</div>12 hướng dẫn
</div>
```

---

## ✅ Checklist Khi Thêm Mục Mới

- [ ] Thêm `toc-item` vào `div.toc-grid` trong **index.html**
- [ ] Thêm `toc-item` vào `div.toc-grid` trong **admin.html**
- [ ] Thêm `div.section` nội dung vào **index.html**
- [ ] Thêm `div.section` nội dung vào **admin.html**
- [ ] Cập nhật số đếm "X hướng dẫn" trong banner header (**cả 2 file**)
- [ ] Nếu dùng pagination: thêm dòng vào mảng `TOC_ITEMS` trong **script.js**
- [ ] Nếu số mục lẻ: kiểm tra có ô trống placeholder không
- [ ] Mở trình duyệt kiểm tra thử
- [ ] Vào `admin.html` upload ảnh nếu có
- [ ] Xuất `data.json` và push lên GitHub

---

*Tài liệu này được tạo ngày 2026-04-28.*
