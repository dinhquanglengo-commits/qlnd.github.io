# 📋 Project Instructions – IT Helpdesk Report Generator (PV GAS)

> Đọc file này trước khi làm bất kỳ thay đổi nào. File này mô tả đầy đủ dự án, kiến trúc, logic, và các điểm quan trọng cần biết.

---

## 1. TỔNG QUAN DỰ ÁN

**Tên file:** `IT_Helpdesk_Report_Generator_v3.html`  
**Loại:** Single-file HTML app — chạy thẳng trên trình duyệt, không cần server, không cần cài đặt.  
**Mục đích:** Đọc file Excel Helpdesk của PV GAS → hiển thị biểu đồ thống kê → xuất báo cáo tháng dạng **Word (.docx)** và **PDF** theo chuẩn công văn hành chính PV GAS.

---

## 2. LUỒNG HOẠT ĐỘNG

```
Upload Excel (.xlsx)
      ↓
Đọc sheet "query" bằng SheetJS
      ↓
Parse + auto-map cột → allData[]
      ↓
Chọn tháng → monthData[] (filter theo năm/tháng)
      ↓
Render KPI + 4 loại biểu đồ (Chart.js)
      ↓
Xuất Word           Xuất PDF
    ↓                   ↓
captureChart()      captureChart()
    ↓                   ↓
Claude API (ATTT    Claude API (ATTT
+ đánh giá)         + đánh giá)
    ↓                   ↓
docx.js build       html2canvas → jsPDF
    ↓                   ↓
Download .docx      Download .pdf
```

---

## 3. CẤU TRÚC FILE HTML

File duy nhất, khoảng ~2200 dòng, gồm 3 phần:

### 3.1. `<head>` — CDN Scripts
```html
xlsx 0.18.5       → đọc Excel
docx 8.5.0        → tạo Word
Chart.js 4.4.1    → biểu đồ
jsPDF 2.5.1       → tạo PDF
html2canvas 1.4.1 → render HTML → ảnh cho PDF
```

### 3.2. `<style>` — CSS
- CSS Variables: `--p` (primary blue `#1a56db`), `--font` (Segoe UI)
- **Quan trọng:** `button, input { font-family: var(--font) }` — bắt buộc vì browser không tự kế thừa font vào button → fix lỗi font tiếng Việt bị vỡ.

### 3.3. `<body>` — HTML + JavaScript

**HTML structure:**
```
.hdr          → Header + logo PV GAS
#upzone       → Upload card (Step 1)
#monthCard    → Month picker (Step 2) — hidden until file loaded
#preview      → Preview section — hidden until month selected
  .kpi-row    → 4 KPI boxes
  .card       → Charts card (tabs: bar/pie/doughnut/column)
  .card       → Ticket table
  .card       → Export card (Step 3) — Word + PDF buttons
#floatBtn     → Floating Word button (bottom right)
#floatBtnPdf  → Floating PDF button (bottom right, left of Word button)
#expBanner    → Sticky banner (shows after month selected)
```

---

## 4. BIẾN TRẠNG THÁI TOÀN CỤC

```javascript
allData[]      // Toàn bộ dữ liệu từ Excel
monthData[]    // Dữ liệu đã filter theo tháng đang chọn
selYear        // Năm đang chọn (number)
selMonth       // Tháng đang chọn (number, 1-12)
curView        // Kiểu chart đang hiện: 'bar'|'pie'|'doughnut'|'column'
CI{}           // Chart instances — dùng để destroy trước khi re-render
MN[]           // Mảng tên tháng: ['Tháng 1', ..., 'Tháng 12']
COLORS_C[]     // Palette 12 màu — module level, dùng bởi captureChart()
logoBase64     // Base64 PNG của logo PV GAS — embedded sẵn trong JS const
```

---

## 5. CÁC HÀM QUAN TRỌNG

### 5.1. Data pipeline
| Hàm | Dòng | Mô tả |
|-----|------|-------|
| `processFile(file)` | ~977 | Đọc file Excel, parse, build `allData[]`, hiện month picker |
| `parseD(v)` | ~1004 | Parse date từ nhiều kiểu (Date object, Excel serial number, string) |
| `buildMonths(mmap)` | ~1012 | Render các nút chọn tháng kèm số ticket |
| `cnt(data, field, top)` | ~1046 | Đếm tần suất theo field, trả về `[[label, count], ...]` sorted |

### 5.2. Render
| Hàm | Dòng | Mô tả |
|-----|------|-------|
| `renderAll()` | ~1025 | Gọi sau khi chọn tháng — render KPI, chart, table, show float buttons |
| `switchChart(type)` | ~1065 | Chuyển tab chart: 'bar'/'pie'/'doughnut'/'column' |
| `renderBarView()` | ~1081 | Render horizontal bar lists |
| `renderPieView()` | ~1094 | Render 4 pie charts |
| `renderDoughnutView()` | ~1097 | Render 4 donut charts |
| `renderColumnView()` | ~1117 | Render 2 vertical bar charts |
| `renderTable()` | ~1136 | Render bảng ticket gần nhất (15 dòng) |

### 5.3. Chart capture (module level — quan trọng!)
```javascript
// ⚠️ HÀM NÀY Ở MODULE LEVEL, KHÔNG nằm trong exportWord hay exportPdf
function captureChart(labels, values, chartType, title, ptW, ptH)
```
- Render chart vào offscreen canvas (position:fixed; left:-9999px)
- Scale 2× cho chất lượng cao
- Trả về Promise<{ b64: string, ptW: number, ptH: number }>
- Dùng `COLORS_C[]` — cũng phải ở module level

**⚠️ Bài học đã học:** Nếu để `captureChart` hoặc `COLORS_C` bên trong `exportWord`, thì `exportPdf` sẽ lỗi `is not defined`. Phải để ở module level.

### 5.4. Export Word
```javascript
async function exportWord(src)  // src: 'main'|'banner'|'float'
```
Luồng bên trong:
1. `setLoading(true)` — disable tất cả buttons
2. Destructure `docx.*` — **`ImageRun` phải nằm trong destructure đầu tiên này**
3. Build data: loaiC, itC, htC, mucC, dvC, diff vs tháng trước
4. Phân loại nhân sự: `THUE_NGOAI_SET = ['DAT.ND2', 'QUANG.LND']` → soChinhThuc/soThueNgoai
5. Phạm vi đơn vị: filter từ `monthData` — chỉ đơn vị có ticket thực tế
6. Gọi Claude API → parse JSON → build sec5 (ATTT) + sec6 (Đánh giá)
7. `captureChart()` × 4 — sequential await (không Promise.all)
8. Build Word document với docx.js
9. `Packer.toBlob()` → download

**⚠️ Các lỗi đã gặp và fix:**
- `ImageRun is not defined` → phải destructure cùng lúc với Document, Packer...
- `COLORS_C is not defined` → phải để ở module level
- `captureChart is not defined` → phải để ở module level
- Biểu đồ bị méo/vỡ → canvas phải `position:fixed;left:-9999px` (không phải `display:none`)
- Chart render song song bị lỗi → dùng sequential `await` thay vì `Promise.all`

### 5.5. Export PDF
```javascript
async function exportPdf()
```
Luồng bên trong:
1. Gọi Claude API (code riêng, không dùng lại từ exportWord)
2. `captureChart()` × 4 — sequential
3. Build HTML string (công văn hành chính layout)
4. Inject vào `<iframe>` ẩn
5. `html2canvas()` render toàn bộ body
6. Cắt theo trang A4, `jsPDF.addImage()` cho mỗi trang
7. `pdf.save(fname)`

---

## 6. CẤU TRÚC BÁO CÁO WORD

Format: **Công văn hành chính PV GAS** — Times New Roman 13pt, màu xanh lá `#00703C`.

```
Letterhead (3 cột):
  [Logo PV GAS] | TỔNG CÔNG TY / BAN KTCN | CỘNG HÒA...
Số văn bản + V/v + Ngày tháng
---
Tiêu đề: BÁO CÁO LÃNH ĐẠO BAN
Kính gửi: Ông Trần Huy Thực – Trưởng Ban KTCN
Mở đầu
---
- Tổng quan:
    Phạm vi: [dynamic — chỉ đơn vị CÓ TICKET trong tháng]
    Khách hàng: VIP / Trưởng phó Ban / CBCNV
- Thống kê ticket: [bảng loại YC]
- Thống kê khách hàng: [bảng mức độ]
- Thống kê nhân sự: [N chính thức, M thuê ngoài] + bảng mô tả
- So sánh tháng trước: [diff ticket, top hệ thống]
- Danh sách ticket gần nhất: [20 ticket, cột: Ngày/Người YC/IT/Hệ thống/Loại YC/TT]
- Tình hình ATTT: [AI generated]
- Đánh giá & Kiến nghị: [AI generated]
- Biểu đồ thống kê: [4 charts 2×2 grid]
---
Nơi nhận | NGƯỜI LẬP (trống)
```

---

## 7. CÁC QUY TẮC PHÂN LOẠI DỮ LIỆU

### 7.1. Nhân sự thuê ngoài (hardcoded)
```javascript
const THUE_NGOAI_SET = new Set(['DAT.ND2', 'QUANG.LND']);
```
→ Tất cả nhân sự khác = chính thức TCT.

### 7.2. Phân loại đơn vị
```javascript
const grpKDH = new Set(['KDH']);  // Cơ quan điều hành
const grpTM  = new Set(['DVK','KTN','KDK','DAK','LNG','LOG','KDN','KBB','KCM','KHP','KVT','NCSP','PVCOATING','PVPIPE','KTA','SAP']);
// Còn lại → "Khác"
```
→ Chỉ hiển thị nhóm nào có ticket thực tế trong tháng.

### 7.3. 4 biểu đồ trong Word/PDF
| Vị trí | Nội dung | Kiểu |
|--------|----------|------|
| Trên trái | Phân loại yêu cầu | doughnut |
| Trên phải | IT Helpdesk xử lý | doughnut |
| Dưới trái | Top hệ thống hỗ trợ | hbar (horizontal bar) |
| Dưới phải | **Đơn vị yêu cầu** | doughnut |

> ⚠️ Ô dưới phải là **Đơn vị**, KHÔNG phải Mức độ ưu tiên.

---

## 8. CLAUDE API INTEGRATION

Endpoint: `https://api.anthropic.com/v1/messages`  
Model: `claude-sonnet-4-20250514`  
Max tokens: 1800

**System prompt yêu cầu trả về JSON:**
```json
{
  "attt": {
    "succo": "...",
    "threats": "...",
    "danhGiaChung": "..."
  },
  "danhGia": {
    "hieuQua": "...",
    "vaiTro": "...",
    "diemNoiBat": ["...", "...", "..."],
    "kienNghi": ["...", "...", "...", "..."]
  }
}
```

**Fallback:** Nếu API lỗi → dùng template tĩnh từ data, báo cáo vẫn tạo thành công.

**Data gửi lên API:**
- Tổng ticket, hoàn thành, đang xử lý, % hoàn thành
- Số người dùng, nhân sự IT (chính thức/thuê ngoài), avg ticket/người
- Tháng trước: tên, tổng, chênh lệch
- Top 5 hệ thống, top 5 IT, top 4 đơn vị, top 6 loại YC
- Nhạy cảm bảo mật: email count, VPN count, phức tạp count

---

## 9. LOGO PV GAS

Logo được embed dưới dạng base64 PNG trực tiếp trong JS:
```javascript
const logoBase64 = 'iVBORw0KGgo...'; // ~25KB base64
```
- Ảnh gốc: 120×157px, đã xử lý transparent background
- Hiển thị trên web: `<img src="data:image/png;base64,${logoBase64}">`
- Trong Word: `ImageRun` với `transformation: { width: 54, height: 70 }` (giữ tỷ lệ 120:157)
- Trong PDF: nhúng vào HTML string, html2canvas render

---

## 10. CẤU TRÚC DỮ LIỆU EXCEL

Sheet: `query` (fallback về sheet đầu tiên nếu không có)

Các cột được auto-map (case-insensitive, bỏ space):
| Field trong app | Tên cột Excel |
|-----------------|---------------|
| `date` | NgayYeuCau |
| `itid` | ITID |
| `user` | Ngườiyêucầu |
| `donvi` | DonViID |
| `hethong` | HeThongID |
| `mucdo` | MucDoID |
| `loai` | LoaiYeuCauID |
| `tinhtrang` | TinhTrangID |
| `title` | Tiêuđề |

---

## 11. BUTTONS VÀ UI

### Nút xuất — có 3 vị trí:
1. **Step 3 card** (cuối trang): "Tải xuống file Word (.docx)" (xanh) + "Tải xuống PDF" (đỏ)
2. **Banner** (sticky top khi scroll): "Xuất Word & Tải xuống" + "Xuất PDF"
3. **Floating buttons** (góc phải màn hình): Word (xanh) + PDF (đỏ)

### setLoading(loading):
Disable/enable tất cả: `btnExp`, `btnExpBanner`, `floatBtn`, `btnPdf`, `btnPdfBanner`, `floatBtnPdf`

### ⚠️ Font buttons:
```css
button, input, select, textarea { font-family: var(--font); }
```
Phải có dòng này — browser không tự kế thừa font vào `<button>`.

---

## 12. NHỮNG VIỆC ĐÃ HOÀN THÀNH

- [x] Upload & đọc Excel, auto-map cột
- [x] Chọn tháng dynamic
- [x] 4 loại biểu đồ với tab switcher
- [x] Bảng ticket: Ngày / Người YC / IT Helpdesk / Hệ thống / Loại YC / Mức độ / Trạng thái
- [x] Export Word: format công văn hành chính đầy đủ
- [x] Export PDF: giống hệt Word, multi-page A4
- [x] Claude AI viết ATTT + Đánh giá — nội dung khác mỗi tháng
- [x] Logo PV GAS (transparent) trong cả web, Word, PDF
- [x] Phạm vi đơn vị dynamic — chỉ đơn vị có ticket thực tế
- [x] Nhân sự: DAT.ND2 + QUANG.LND = thuê ngoài, còn lại = chính thức
- [x] Biểu đồ trong Word/PDF: 4 charts đúng (Loại YC / IT / Hệ thống / **Đơn vị**)

---

## 13. NHỮNG VIỆC CÓ THỂ CẦN LÀM TIẾP

- [ ] Thêm trường nhập tên người lập (thay vì để trống)
- [ ] So sánh nhiều tháng / trend analysis
- [ ] Gửi báo cáo tự động qua Teams/Email
- [ ] Lưu cấu hình người dùng (Trưởng Ban, người lập...)
- [ ] Hỗ trợ báo cáo tuần / quý

---

## 14. LƯU Ý KỸ THUẬT QUAN TRỌNG

### ❌ Những lỗi thường gặp:
1. **`X is not defined` trong exportPdf** → kiểm tra xem biến/hàm có ở module level không, hay bị kẹt trong `exportWord` scope
2. **Biểu đồ bị trắng/vỡ** → dùng `position:fixed;left:-9999px` cho canvas, KHÔNG dùng `display:none`
3. **Biểu đồ chỉ render 1-2 chart** → dùng sequential `await`, không dùng `Promise.all`
4. **Font button bị vỡ tiếng Việt** → thêm `font-family: var(--font)` vào CSS button
5. **Word download không hoạt động** → dùng `Packer.toBlob()` không phải `Packer.toBuffer()`

### ✅ RULES KHI LÀM VIỆC (BẮT BUỘC)
1. **Nếu thay đổi lớn** (đụng nhiều phần/logic/kiến trúc, refactor lớn, hoặc khó ước lượng rủi ro) → **phải đưa ra Plan + Task breakdown** và **chờ bạn confirm** trước khi bắt đầu chỉnh sửa code.
2. **Khi có task được giao** → **chỉ chỉnh sửa/ thêm code liên quan trực tiếp đến task đó**; **tuyệt đối không sửa** các phần code cũ đang hoạt động ổn định (trừ khi task yêu cầu hoặc có bug liên quan trực tiếp).

### ✅ Nguyên tắc khi sửa:
- Luôn dùng Python để thay thế đoạn code lớn (tránh lỗi str_replace với Unicode)
- Sau khi sửa, chạy `node -e` để validate các điều kiện quan trọng
- Copy sang `/mnt/user-data/outputs/` và gọi `present_files` để giao file

---

## 15. WORKFLOW SỬA FILE

```bash
# Copy file upload về working dir
cp /mnt/user-data/uploads/IT_Helpdesk_Report_Generator_v3.html /home/claude/IT_Helpdesk_v3.html

# Sửa bằng str_replace hoặc Python
# ...

# Validate
node -e "const h = require('fs').readFileSync('/home/claude/IT_Helpdesk_v3.html','utf8'); console.log('size:', h.length);"

# Deploy
cp /home/claude/IT_Helpdesk_v3.html /mnt/user-data/outputs/IT_Helpdesk_Report_Generator_v3.html
```

---

*Tài liệu này được tạo tự động từ lịch sử phát triển dự án. Cập nhật lần cuối: 05/2026.*
