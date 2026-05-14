# 📋 PROJECT SPEC — CS Case Opening Simulator

> **Dành cho AI model:** Đọc file này trước khi làm bất kỳ thay đổi nào. Không cần đọc lại toàn bộ codebase nếu đã đọc spec này.

---

## 🔒 QUY TẮC BẮT BUỘC CHO AI MODEL

> ⚠️ **PHẢI tuân thủ nghiêm ngặt. Vi phạm bất kỳ quy tắc nào = không chấp nhận.**

### Quy trình làm việc (MANDATORY WORKFLOW)

```
1. LÊN KẾ HOẠCH (Plan)   →   2. LÊN TASK   →   3. HỎI USER   →   4. THỰC HIỆN   →   5. TEST
```

| Bước | Hành động | Bắt buộc |
|------|-----------|----------|
| **1. Plan** | Viết implementation plan rõ ràng, liệt kê file nào sẽ thay đổi, thay đổi gì | ✅ |
| **2. Task** | Tạo checklist task.md các việc cần làm | ✅ |
| **3. Hỏi User** | Trình bày plan, hỏi xác nhận trước khi chỉnh code | ✅ |
| **4. Thực hiện** | Chỉ làm sau khi user approve | ✅ |
| **5. Test** | Mô tả cách kiểm tra, yêu cầu user xác nhận kết quả | ✅ |

### Các quy tắc cứng (HARD RULES)

1. **❌ KHÔNG tự ý đổi code** — Không được sửa bất cứ thứ gì mà user chưa yêu cầu hoặc chưa approve.
2. **✂️ Chỉ chỉnh sửa phần được yêu cầu** — Nếu user yêu cầu sửa button, chỉ sửa button, không đụng vào CSS toàn cục hay logic khác.
3. **🚫 Không tự ý thêm mới** — Không thêm feature, file, function, class mới nếu user không yêu cầu. Kể cả thêm comment hoặc refactor cũng phải hỏi trước.
4. **📖 Đọc spec này trước** — Mỗi phiên làm việc mới phải đọc file này trước khi hỏi hay làm gì.
5. **🧪 Phải test** — Sau mỗi thay đổi phải mô tả test case và yêu cầu user xác nhận trên browser.

---

## 📁 Cấu trúc dự án

```
csgo_case/
└── csgo_case.html       # File duy nhất — toàn bộ app nằm trong đây (HTML + CSS + JS)
```

**Ghi chú quan trọng:** Đây là **single-file app** (monolithic). Không có build tool, không có npm, không có framework. Mọi thứ nằm trong `csgo_case.html`.

---

## 🎮 Mô tả dự án

**Tên:** CS Case Opening Simulator  
**Loại:** Single-page web app, không có backend  
**Mục đích:** Mô phỏng việc mở case CS:GO với hệ thống xác suất, inventory và coin

### Tính năng hiện có

| Tính năng | Mô tả |
|-----------|-------|
| **Case Selector** | 3 loại case: Weapon Case, Dreams & Nightmares, Recoil Case |
| **Spin Animation** | Track scroll 60 item, winner tại vị trí 48, smooth cubic-bezier |
| **Open 1 / Open 10** | Mở 1 hoặc 10 case cùng lúc |
| **Rarity System** | 5 rarity: Blue/Purple/Pink/Red/Gold với tỷ lệ CS:GO thực |
| **Wear System** | 5 wear: FN/MW/FT/WW/BS với weight và value multiplier |
| **Inventory** | Lưu item đã nhận, hiển thị grid, bán từng item |
| **Sell All** | Bán toàn bộ inventory 1 click |
| **Stats** | Đếm cases opened, knives found, coins spent, items value |
| **History Strip** | Thanh 40 item gần nhất |
| **Drop Rates** | Toggle hiển thị tỷ lệ rơi từng rarity |
| **Coin System** | Bắt đầu 1000 coins, nút +500 coins |
| **Notification** | Toast notification góc phải |

---

## 🏗️ Kiến trúc code (`csgo_case.html`)

### Cấu trúc file

```
<html>
  <head>
    <style>          ← CSS (dòng 7–111)
    </style>
  </head>
  <body>
    <div id="app">  ← HTML structure (dòng 114–172)
    <div result-overlay>  ← Modal result (dòng 175–187)
    <div notif>     ← Toast notification (dòng 190)
    <script>        ← JavaScript (dòng 192–584)
    </script>
  </body>
</html>
```

### Dữ liệu (DATA section — JS dòng 193–315)

| Biến | Kiểu | Mô tả |
|------|------|-------|
| `WEAR` | Array | 5 wear level với label, short, value multiplier |
| `WEAR_WEIGHTS` | Array | Xác suất wear [5,15,40,25,15] |
| `RARITIES` | Array | 5 rarity với id, label, color, chance, CSS class |
| `CASES` | Array | 3 case với id, name, icon, price, items theo rarity |

### State (dòng 318–319)

| Biến | Kiểu | Mô tả |
|------|------|-------|
| `balance` | Number | Số coin hiện tại (default: 1000) |
| `inventory` | Array | Danh sách item đang giữ |
| `stats` | Object | {opened, knives, spent} |
| `currentCase` | Number | Index case đang chọn (0–2) |
| `spinning` | Boolean | Lock khi đang spin |
| `pendingItem` | Object/null | Item chờ kết quả sau spin |

### Các hàm chính

| Hàm | Dòng | Chức năng |
|-----|------|-----------|
| `buildTabs()` | 327 | Render tab chọn case |
| `selectCase(i, el)` | 338 | Chuyển case |
| `buildOdds()` | 350 | Render bảng tỷ lệ rơi |
| `buildTrack(winner?)` | 364 | Build 60-item spin track |
| `getAllItems(cs)` | 384 | Lấy toàn bộ items + wear từ 1 case |
| `rollItem(cs)` | 396 | Random item theo rarity |
| `pickWear()` | 411 | Random wear level |
| `openOne()` | 419 | Mở 1 case (trừ coin → spin) |
| `openTen()` | 433 | Mở 10 case (không animate) |
| `spinTo(item)` | 451 | Chạy animation spin |
| `showResult(item)` | 480 | Hiển thị modal kết quả |
| `closeResult(sell)` | 494 | Đóng modal, keep/sell |
| `addToInventory(item)` | 512 | Thêm item vào inventory |
| `renderInv()` | 516 | Render inventory grid |
| `sellFromInv(id,val,name)` | 538 | Bán 1 item từ inventory |
| `addHistory(item)` | 548 | Thêm vào history strip |
| `updateBalance()` | 561 | Cập nhật UI balance |
| `updateStats()` | 564 | Cập nhật UI stats |
| `setBtns(dis)` | 569 | Enable/disable buttons |
| `addCoins()` | 573 | +500 coins |
| `showNotif(msg)` | 578 | Toast notification |

### CSS Classes quan trọng

| Class | Mô tả |
|-------|-------|
| `.r-blue / .r-purple / .r-pink / .r-red / .r-gold` | Background màu theo rarity |
| `.spin-track` | Container chạy animation translateX |
| `.result-overlay.show` | Modal hiển thị khi có class `.show` |
| `.odds-table.show` | Bảng odds hiện khi toggle |
| `.case-tab.active` | Tab case đang chọn |

---

## 🎨 Design System

| Token | Giá trị |
|-------|---------|
| **Background** | `#0f0f1a` |
| **Surface** | `#1a1a2e` |
| **Border** | `#333`, `#2a2a3e` |
| **Gold accent** | `#e4b000` |
| **Text primary** | `#fff` |
| **Text secondary** | `#aaa`, `#666` |
| **Font** | `'Segoe UI', sans-serif` |
| **Rarity Blue** | `#4a90d9` |
| **Rarity Purple** | `#9b59b6` |
| **Rarity Pink** | `#e91e8c` |
| **Rarity Red** | `#eb4b4b` |
| **Rarity Gold** | `#e4b000` |

---

## 📊 Xác suất drop

| Rarity | Tỷ lệ |
|--------|--------|
| Mil-Spec (Blue) | 79.92% |
| Restricted (Purple) | 15.98% |
| Classified (Pink) | 3.20% |
| Covert (Red) | 0.64% |
| Rare Special (Gold/Knife) | 0.26% |

---

## 📝 CHANGELOG

### [v1.1.1] — 2026-05-14
- **Refactor:** Tách toàn bộ Data cấu hình game (Tỉ lệ rớt, Danh sách hòm, Giá tiền, Danh sách vũ khí, Độ mòn...) ra file độc lập `data.js`.
- **Feature:** Hỗ trợ tính năng thay thế Emoji bằng Hình ảnh (Images) thực tế. Bằng cách thêm trường `img: "link-anh"` vào file `data.js`, hình ảnh súng sẽ hiển thị trên thanh cuộn (Track), trong thông báo trúng thưởng (Result), thẻ kho đồ (Inventory), và lịch sử rơi đồ (History strip).

---

### [v1.1.0] — 2026-05-14
- **Feature (Roguelite Mode):** Thay đổi hoàn toàn gameplay thành dạng Roguelite:
  - Game chia thành nhiều Round. Bắt đầu Round 1 với `500 coins`.
  - Mục tiêu (Goal) của Round 1 là `1000 coins`. Khi qua mỗi Round, mục tiêu sẽ tự động tăng theo hệ số `x1.5`.
  - Khi qua màn, người chơi bị reset lại lượng tiền khởi điểm và mất sạch Inventory, nhưng được chọn 1 trong 3 lá bài Buff vĩnh viễn.
  - **Buff Luck (+10%):** Tăng 10% tỷ lệ ra item từ Restricted (Tím) trở lên và giảm tương ứng tỷ lệ đồ Xanh. Có cộng dồn.
  - **Buff Sell Value (+10%):** Mọi item bán ra đều đắt hơn 10%. Có cộng dồn.
  - **Buff Start Gold (+100):** Tăng lượng tiền khởi điểm mỗi khi qua màn thêm 100.
  - **Thua:** Khi phá sản (tổng tài sản < 50), toàn bộ quá trình bị reset về lại Round 1 và mất mọi Buff.

---

### [v1.0.7] — 2026-05-14
- **Fix:** Sửa lỗi lệch tâm kim chỉ (Needle) khi quay case. Các item có tên quá dài làm thay đổi chiều rộng thực tế của thẻ (vì text giãn ra), khiến việc dùng toán cố định `48 * 104px` gây sai lệch. Hiện tại đã lấy trực tiếp offset của item trúng thưởng trong DOM để đảm bảo kim luôn chỉ chính xác 100%.

---

### [v1.0.6] — 2026-05-14
- **Fix:** Sửa lỗi logic tính `Total PnL`. Hiện tại `Got` và `Net` sẽ lưu lại tổng giá trị tất cả item kiếm được từ đầu game (`stats.earned`), thay vì chỉ tính những item đang nằm trong inventory. Đảm bảo việc bán item không làm Total PnL báo lỗ sai lệch.

---

### [v1.0.5] — 2026-05-14
- **Feat:** Thêm luật chơi (Win/Loss condition) dựa trên tổng tài sản (Balance + Total Inventory Value):
  - **Win:** Tổng tài sản >= 10,000 coins.
  - **Lose:** Tổng tài sản < 50 coins (không đủ mua case rẻ nhất).
- **Feat:** Thêm Modal báo Victory / Game Over cùng nút "Play Again" (restart toàn bộ game).
- **Remove:** Xoá bỏ nút `+500 coins` và hàm `addCoins()` để game có độ khó thực sự.

---

### [v1.0.4] — 2026-05-14
- **Feat:** Thay đổi hiển thị kết quả lượt quay ("This Turn") ở dưới `.inv-header`. Hiển thị chi tiết (Spent / Got / Net) thay vì chỉ hiện `Last: X coins`.
- **Refactor:** `turnSpent`, `turnGot` và `pendingSpent` thay thế `lastDropVal` để theo dõi chính xác lợi nhuận của mỗi lượt quay (1x và 10x).

---

### [v1.0.3] — 2026-05-14
- **Refactor:** PnL (Spent/Got/Net) chuyển vào stats row, luôn hiển thị cạnh Cases Opened & Knives Found
- **Feat:** Inv-header hiện `🎲 Last: X coins` — giá trị item lần quay gần nhất (ẩn cho đến lần spin đầu)
- **Refactor:** Xoá stat box "Coins Spent" và "Items Value" (thay bằng PnL inline)
- **Refactor:** Tách `updatePnL()` thành helper độc lập, gọi từ cả `updateStats()` và `renderInv()`

---

### [v1.0.2] — 2026-05-14
- **Feat:** Thêm PnL display cạnh nút Sell All — hiển thị Spent / Got / Net
  - Net dương → xanh lá (`+X coins`)
  - Net âm → đỏ (`-X coins`)
  - Ẩn khi inventory rỗng, hiện khi có item

---

### [v1.0.1] — 2026-05-14
- **Fix:** Thêm hàm `sellAll()` vào JS (trước đó nút tồn tại trong HTML nhưng function chưa được implement)
- **Fix:** `renderInv()` giờ tự động hiện/ẩn nút `Sell All` theo trạng thái inventory

---

### [v1.0.0] — 2026-05-14
- **Init:** Tạo file `csgo_case.html` — single-file CS Case Opening Simulator
- 3 cases: Weapon Case, Dreams & Nightmares, Recoil Case
- Spin animation với 60-item track
- Inventory system (keep/sell, sell all)
- Stats: cases opened, knives found, coins spent, items value
- History strip 40 item
- Drop rate viewer
- Coin system (+500 button)
- Toast notification

---

## ✅ Checklist trước khi làm việc (AI Model phải tự check)

- [ ] Đã đọc toàn bộ file PROJECT_SPEC.md này
- [ ] Đã hiểu đây là single-file app, không có build tool
- [ ] Đã xác định rõ phần nào cần thay đổi (theo yêu cầu user)
- [ ] Đã viết implementation plan
- [ ] Đã tạo task checklist
- [ ] Đã hỏi và nhận approve từ user
- [ ] Sau thay đổi: đã mô tả cách test và yêu cầu user confirm
