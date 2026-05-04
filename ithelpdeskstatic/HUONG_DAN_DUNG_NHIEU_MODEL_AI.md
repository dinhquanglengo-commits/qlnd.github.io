# 🤖 Hướng Dẫn Làm Việc Với Nhiều AI Model

> Tài liệu này giúp bạn switch giữa các AI model (Gemini, Claude, GPT...) mà **không bị mất code** hay bị model mới viết lại lung tung.

---

## ❓ Vấn đề thường gặp

Khi bị hết quota và phải switch sang model khác, model mới **không có bộ nhớ về cuộc hội thoại cũ**. Hậu quả thường gặp:

- ❌ Model mới **viết lại toàn bộ code** thay vì chỉ chỉnh sửa chỗ cần thiết
- ❌ Model mới **xóa logic cũ** mà bạn đã tốn công xây dựng
- ❌ Model mới **thay đổi kiến trúc** file, đổi tên hàm, đổi CSS class...
- ❌ Model mới **thêm dependencies** không cần thiết (Tailwind, framework lạ...)

---

## 🛡️ Các Quy Tắc Vàng Khi Switch Model

### Quy Tắc 1: Luôn Cho Model Đọc Code Trước

> [!IMPORTANT]
> **KHÔNG BAO GIỜ** mô tả vấn đề bằng lời mà không cung cấp code thực tế. Hãy cho model đọc file nguồn trước tiên.

Trước khi yêu cầu bất cứ điều gì, hãy mở file cần chỉnh sửa và để cursor vào đó. Model sẽ tự động nhận ra context từ file đang mở.

---

### Quy Tắc 2: Dùng "System Prompt" Khi Bắt Đầu Cuộc Hội Thoại Mới

Mỗi khi switch model hoặc bắt đầu một cuộc hội thoại mới, hãy **paste đoạn prompt sau vào tin nhắn đầu tiên**, rồi thêm yêu cầu của bạn vào bên dưới:

---

#### 📋 TEMPLATE PROMPT — COPY VÀ ĐIỀN VÀO

```
⚠️ QUAN TRỌNG — ĐỌC TRƯỚC KHI LÀM BẤT CỨ ĐIỀU GÌ:

Dự án của tôi là: [mô tả ngắn, VD: "IT Helpdesk portal, web tĩnh thuần HTML/CSS/JS"]
File chính: [VD: index.html, admin.html, script.js, styles.css]
Bạn vừa tiếp nhận từ một model AI khác. Code hiện tại đang hoạt động tốt.

CÁC RÀNG BUỘC BẮT BUỘC:
1. TUYỆT ĐỐI KHÔNG được viết lại toàn bộ file. Chỉ được chỉnh sửa đúng phần được yêu cầu.
2. TUYỆT ĐỐI KHÔNG được thay đổi cấu trúc HTML tổng thể, tên CSS class, tên hàm JS đang dùng.
3. TUYỆT ĐỐI KHÔNG được thêm thư viện/framework bên ngoài (React, Tailwind, Vue...) trừ khi tôi yêu cầu.
4. Khi sửa code: chỉ hiển thị phần code được thay đổi, KHÔNG cần hiển thị lại toàn bộ file.
5. Nếu muốn đề xuất thay đổi lớn, hãy hỏi tôi trước khi làm.

Yêu cầu của tôi hôm nay:
[Viết yêu cầu của bạn ở đây]
```

---

### Quy Tắc 3: Backup Code Trước Khi Switch

> [!CAUTION]
> Luôn tạo backup trước khi bắt đầu phiên làm việc với model mới. Đừng tin tưởng hoàn toàn bất kỳ model nào sẽ giữ nguyên code của bạn.

**Cách backup nhanh trong VS Code:**
1. Bấm `Ctrl + Shift + P` → gõ `Copy File` → lưu với tên `index.html.bak`
2. Hoặc dùng thư mục `/backup/` trong dự án của bạn (bạn đã có sẵn rồi ✅)

---

### Quy Tắc 4: Yêu Cầu Model Giải Thích Trước Khi Sửa

Với mọi yêu cầu thay đổi lớn, thêm vào cuối prompt:

```
Trước khi sửa, hãy cho tôi biết:
- Bạn sẽ thay đổi những file nào?
- Bạn sẽ thay đổi những phần nào trong file đó?
- Có phần nào của code hiện tại sẽ bị xóa không?
```

---

### Quy Tắc 5: Yêu Cầu Trả Về Dạng "Diff" Không Phải File Hoàn Chỉnh

Thay vì để model trả về cả file HTML/JS dài, hãy yêu cầu rõ:

```
Hãy chỉ cho tôi phần code cần thay đổi, không cần copy lại toàn bộ file.
Ghi rõ thêm vào dòng bao nhiêu, hay thay thế đoạn nào.
```

---

## 📌 Checklist Trước Khi Switch Model

Trước khi chuyển sang model mới, hãy làm những việc này:

- [ ] **Git commit** (hoặc copy file sang thư mục backup thủ công)
- [ ] **Ghi chú lại trạng thái** hiện tại: đang làm tính năng gì, đang dở ở đâu
- [ ] **Chuẩn bị prompt tóm tắt** (xem phần dưới)
- [ ] Kiểm tra website đang chạy đúng không (F5 một lần)

---

## 📌 Checklist Sau Khi Switch Model Xong

Sau khi nhận code từ model mới, kiểm tra:

- [ ] Mở file và kiểm tra xem có phần nào bị **xóa/thay đổi ngoài ý muốn** không
- [ ] **Chạy thử** trên trình duyệt ngay
- [ ] Kiểm tra console (F12) xem có lỗi JavaScript không
- [ ] So sánh với file backup nếu nghi ngờ

---

## 📝 Template Tóm Tắt Trạng Thái Dự Án (Dùng Khi Bắt Đầu Phiên Mới)

Lưu template này lại, mỗi khi switch model thì cập nhật nội dung và paste vào:

```
=== TÓM TẮT DỰ ÁN ===
Tên dự án: IT Helpdesk Portal (GitHub Pages + SharePoint iframe)
Công nghệ: HTML thuần, CSS thuần, Vanilla JavaScript
Không dùng framework nào (không React, không Vue, không Tailwind)

Các file chính:
- index.html     → Trang user xem (không có nút admin)
- admin.html     → Trang quản trị (upload ảnh, xuất/nhập JSON)
- script.js      → Logic chung cho cả 2 trang
- styles.css     → Style toàn bộ

Tính năng đã hoàn thành:
- [x] Dark mode
- [x] Live search
- [x] Accordion
- [x] Modal phòng họp
- [x] Admin upload ảnh (lưu base64 vào localStorage)
- [x] Xuất/Nhập ảnh qua file data.json
- [x] Lightbox xem ảnh phóng to
- [x] Loading screen animation

Trạng thái hiện tại: [MÔ TẢ Ở ĐÂY — VD: "Đang fix lỗi ảnh không hiện trên SharePoint iframe"]

Vấn đề cần giải quyết hôm nay:
[YÊU CẦU CỤ THỂ]

NHẮC LẠI: Không được viết lại code, chỉ sửa đúng phần cần thiết.
```

---

## 🆚 So Sánh Các Model Thường Dùng

| Model | Điểm mạnh | Điểm yếu | Khi nào dùng |
|-------|-----------|----------|--------------|
| **Gemini Pro (High)** | Hiểu context dài, bộ nhớ tốt trong session | Hết quota nhanh với file lớn | Debug phức tạp, viết tính năng mới lớn |
| **Claude Sonnet (Thinking)** | Lý luận logic rất tốt, ít hallucinate | Có thể viết lại nhiều hơn cần | Tìm lỗi logic, giải thích code phức tạp |
| **GPT-4o** | Đa năng, tốt với HTML/CSS | Có thể thêm dependency không cần | UI/UX, viết nội dung, chỉnh CSS |

> [!TIP]
> Với dự án web tĩnh của bạn, **bất kỳ model nào cũng làm được** — vấn đề là cách ra lệnh. Dùng đúng prompt thì model nào cũng an toàn.

---

## 🚨 Dấu Hiệu Model Đang "Làm Hư" Code

Nếu model trả về response có những dấu hiệu sau, hãy **DỪNG LẠI** và không apply:

- Trả về cả 1 file HTML/JS dài 400+ dòng khi bạn chỉ hỏi 1 vấn đề nhỏ
- Đổi tên class CSS (VD: `section-body` → `content-body`)
- Thêm `import` hoặc `require` vào file JS thuần
- Thêm thẻ `<link>` Tailwind CDN vào `<head>`
- Xóa các comment tiếng Việt trong code của bạn
- Đổi `localStorage` thành `fetch API` hoặc ngược lại

---

*Tài liệu này được tạo ngày 2026-04-28. Cập nhật khi có quy trình mới.*
