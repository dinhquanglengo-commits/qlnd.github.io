function toggleAccordion() {
    const content = document.getElementById('accordionContent');
    const arrow = document.getElementById('arrowIcon');
    
    if (!content) return; // Bảo vệ lỗi nếu không có element
    
    if (content.style.maxHeight && content.style.maxHeight !== '0px') {
        // Đóng lại
        content.style.maxHeight = '0px';
        content.classList.remove('open');
        if (arrow) arrow.classList.remove('rotate');
    } else {
        // Mở ra: gán maxHeight bằng scrollHeight để mượt
        content.style.maxHeight = content.scrollHeight + "px";
        content.classList.add('open');
        if (arrow) arrow.classList.add('rotate');
    }
}

// Tự động mở khi trang vừa load (nếu muốn)
window.addEventListener('load', () => {
    if (document.getElementById('accordionContent')) {
        toggleAccordion();
    }
});

// JAVASCRIPT ĐỂ ĐÓNG/MỞ MODAL
const modal = document.getElementById('zaloModal');

function openZaloModal() {
    if(modal) modal.classList.remove('hidden');
}

function closeZaloModal() {
    if(modal) modal.classList.add('hidden');
}

// Đóng popup khi click ra ngoài vùng trắng
if (modal) {
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeZaloModal();
        }
    });
}

// Dữ liệu hướng dẫn các phòng
const guides = {
    'p1401': `
        <strong>Họp trực tuyến qua hệ thống Video Conference (Tập đoàn hoặc các đơn vị thành viên):</strong>
    <br>Bước 1: Kích hoạt Micro phòng họp bằng cách nhấn vào nút nguồn trên thiết bị.
    <br>Bước 2: Trên màn hình điều khiển Cisco: thực hiện quay số (call) tới địa chỉ: <strong>151@10 . 2 . 84 . 10</strong>(viết liền khi nhập)
    <br>Bước 3: Kết nối dây HDMI tại bàn nếu cần trình chiếu.
    <br>Lưu ý: Trường hợp cần kết nối thêm MS Teams nội bộ vui lòng gửi link MS Teams cho bộ phận CNTT.
       <br><strong>Họp trực tuyến qua MS Teams, Zoom (đối tác khách hàng bên ngoài):</strong>
    <br>Bước 1: Kích hoạt Micro phòng họp bằng cách nhấn vào nút nguồn trên thiết bị.
    <br>Bước 2: Kết nối phần cứng cắm các cổng tín hiệu bao gồm: HDMI, USB vào máy tính. (Lưu ý: Nếu chỉ họp nội bộ/offline, chỉ cần kết nối dây HDMI tại bàn để trình chiếu).
    <br>Bước 3: Truy cập đường dẫn (link) cuộc họp. Tại giao diện chờ, thực hiện kiểm tra Camera và Âm thanh trước khi tham gia chính thức.
    <br>Bước 4: Cấu hình thông số:
    <br>Camera: Chọn device là HDMI Capture.
    <br>Âm thanh: Chọn device là Echo Cancelling Speakerphone (Core-pvgas-vip).
    `,
    'p1501': `
        <strong>Họp trực tuyến qua hệ thống Video Conference:</strong>
       <br>Bước 1: Khởi động thiết bị Bật công tắc nguồn và điều khiển từ xa (Remote) của máy chiếu. Kích hoạt Micro phòng họp bằng cách nhấn vào nút nguồn trên thiết bị.
       <br>Bước 2: Sử dụng Remote Polycom, thực hiện quay số (call) tới địa chỉ: <strong>1501@10 . 2 . 84 . 10</strong>(viết liền khi nhập)
       <br>Bước 3: Kết nối dây HDMI vào máy tính cá nhân nếu cần trình chiếu.
     <br><strong>Họp trực tuyến qua MS Teams, Zoom:</strong>
     <br> Bước 1: Tương tự bước 1 phần Video Conference.
     <br> Bước 2: Kết nối phần cứng cắm các cổng tín hiệu bao gồm: HDMI, USB và Jack 3.5mm vào máy tính.
     <br> Bước 3: Truy cập link cuộc họp, kiểm tra Camera và Âm thanh.
     <br> Bước 4: Cấu hình thông số:
     <br>Camera: Chọn device là Polycom EagleEye IV USB. Sử dụng Remote để điều chỉnh góc quay.
     <br>Âm thanh: Chọn device là Speakers / Headphones.
    `,
    'p1502': `
        <strong>Họp trực tuyến qua MS Teams, Zoom,...:</strong>
     <br>Bước 1: Kết nối phần cứng cắm các cổng tín hiệu bao gồm: HDMI, USB vào máy tính.
     <br>Bước 2: Truy cập link cuộc họp, kiểm tra Camera và Âm thanh.
     <br>Bước 3: Cấu hình thông số:
     <br>Camera: Chọn device là Huddly IQ.
     <br>Âm thanh: Chọn device là Echo Cancelling Speakerphone (Crestron Mercury).
     <br>Bước 4: Bật/Tắt Microphone, âm lượng trên màn hình điều khiển Crestron.
    `,
 'P1504':`
 <strong>Họp trực tuyến qua hệ thống Video Conference:</strong>
    <br>Bước 1: Sử dụng remote hoặc màn hình điều khiển Crestron bật máy chiếu.
    <br>Bước 2: Sử dụng remote Polycom hoặc màn hình điều khiển Crestron call tới địa chỉ <strong>1504@10 . 2 . 84 . 10</strong>(viết liền khi nhập)
    <br>Bước 3: Kết nối dây HDMI vào máy tính cá nhân nếu cần trình chiếu.
 `,
 'p1505':`
 <strong>Lưu ý: Không có thiết bị họp trực tuyến.</strong>
  <br>Bước 1: Sử dụng remote máy chiếu chọn cổng INPUT C.
  <br>Bước 2: Trên máy tính nhấn tổ hợp phím WINDOWS + K, chọn device "Meeting Room 5-15F".
 `,
  'p1506':`
<strong>Họp trực tuyến qua MS Teams, Zoom,...:</strong>
<br>Bước 1: Sử dụng remote bật tivi.
<br>Bước 2: Kết nối phần cứng cắm các cổng tín hiệu: HDMI, USB vào máy tính.
<br>Bước 3: Truy cập link cuộc họp, kiểm tra Camera và Âm thanh.
<br>Bước 4: Cấu hình thông số:
<br>Camera: Chọn device là Logitech Meetup.
<br>Âm thanh: Chọn device là Echo Cancelling Speakerphone (Logitech MeetUp Speakerphone).
 `,
  'p1507':`
 <strong>Họp trực tuyến qua hệ thống Video Conference:</strong>
 <br>Bước 1: Sử dụng thiết bị cảm ứng điều khiển, thực hiện quay số tới địa chỉ: <strong>1507@10 . 2 . 84 . 10</strong>(viết liền khi nhập)
 <br>Bước 2: Kết nối dây HDMI vào máy tính nếu cần trình chiếu.
 <br><strong>Họp trực tuyến qua MS Teams, Zoom:</strong>
 <br>Bước 1: Kết nối phần cứng cắm các cổng tín hiệu: HDMI, USB.
 <br>Bước 3: Truy cập link cuộc họp, kiểm tra thiết bị.
 <br>Bước 4: Cấu hình thông số: Camera & Âm thanh chọn nguồn tín hiệu USB PnP Camera/Audio.
 `,
   'p1509':`
 <strong>Hệ thống Video Conference:</strong>
  <br>Bước 2: Trên màn hình điều khiển Crestron (phía trên): Tab "Display Control" chọn POWER ON tivi; Tab "Presentation" chọn Cisco Far.
  <br>Bước 3: Trên màn hình Cisco (phía dưới) quay số tới: <strong>151@10 . 2 . 84 . 10</strong>(viết liền khi nhập)
  <br>Bước 4: Kết nối dây HDMI màu vàng (Outlet 1) vào cổng INPUT hub Ugreen.
  <br><strong>Họp qua MS Teams, Zoom:</strong>
  <br>Bước 3: Kết nối HDMI (vào cổng INPUT hub Ugreen) và USB vào máy tính.
  <br>Bước 5: Cấu hình Camera là HDMI Capture, Âm thanh là Echo Cancelling Speakerphone.
 `,
};

const zaloModal = document.getElementById('zaloModal');
const roomPHModal = document.getElementById('roomModal');
const roomList = document.getElementById('roomList');
const guideDetail = document.getElementById('guideDetail');
const guideText = document.getElementById('guideText');
const roomTitle = document.getElementById('roomTitle');

// Mở Modal Phòng họp
function openPHRoomModal() {
    if(roomPHModal) roomPHModal.style.display = 'flex';
    backToRoomList(); // Reset về danh sách khi mở
}

// Đóng tất cả
function closeAllModals() {
    if(roomPHModal) roomPHModal.style.display = 'none';
    if(zaloModal) zaloModal.style.display = 'none';
}

// Hiện hướng dẫn chi tiết
function showGuide(roomId) {
    if(roomList) roomList.style.display = 'none';
    if(guideDetail) guideDetail.style.display = 'block';
    if(guideText) guideText.innerHTML = guides[roomId];
    if(roomTitle) roomTitle.innerText = "Thông tin hướng dẫn";
}

// Quay lại danh sách phòng
function backToRoomList() {
    if(roomList) roomList.style.display = 'flex';
    if(guideDetail) guideDetail.style.display = 'none';
    if(roomTitle) roomTitle.innerText = "Chọn phòng họp cần hỗ trợ";
}

// Click ra ngoài để đóng
window.onclick = function(event) {
    if (event.target == roomPHModal || event.target == zaloModal) {
        closeAllModals();
    }
}

function toggle(id) {
  var sec = document.getElementById('sec-' + id);
  var chev = document.getElementById('chev-' + id);
  
  if(!sec) return;
  
  var isOpen = sec.classList.contains('open');
  sec.classList.toggle('open', !isOpen);
  if (chev) chev.classList.toggle('open', !isOpen);
  
  if (!isOpen) {
    // Đợi animation mở xong rồi mới cuộn trang cho mượt (tương ứng với thời gian transition CSS)
    setTimeout(function() { sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 400);
  }
}

const progressBar = document.getElementById('progress-bar');
const statusText = document.getElementById('status-text');
const loadingScreen = document.getElementById('loading-screen');

const steps = [
    "Đang kiểm tra bảo mật MFA...",
    "Tải cơ sở dữ liệu PV GAS...",
    "Đồng bộ hóa cấu hình đám mây...",
    "Tối ưu hóa giao diện người dùng...",
    "Khởi tạo thành công!"
];
let currentProgress = 0;
let stepIndex = 0;
const updateLoading = () => {
    // Tăng ngẫu nhiên để tạo cảm giác thật
    currentProgress += Math.floor(Math.random() * 15) + 5;
    if (currentProgress > 100) currentProgress = 100;
    if(progressBar) progressBar.style.width = currentProgress + '%';
    // Cập nhật text theo mốc %
    const targetStep = Math.floor(currentProgress / 25);
    if (targetStep > stepIndex && stepIndex < steps.length - 1) {
        stepIndex = targetStep;
        if(statusText) statusText.innerText = steps[stepIndex];
    }
    if (currentProgress < 100) {
        setTimeout(updateLoading, 300 + Math.random() * 400);
    } else {
        setTimeout(() => {
            if(loadingScreen) {
                loadingScreen.classList.add('fade-out');
                // Xóa hẳn khỏi DOM sau khi ẩn để nhẹ máy
                setTimeout(() => loadingScreen.remove(), 800);
            }
        }, 800);
    }
};
// Bắt đầu chạy sau khi trang load
window.addEventListener('load', () => {
    updateLoading();
    initDarkMode();
    initLightbox();
});

// ==========================================
// 1. CHẾ ĐỘ TỐI (DARK MODE)
// ==========================================
const themeToggle = document.getElementById('themeToggle');

function initDarkMode() {
    // Kiểm tra trạng thái đã lưu
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if(themeToggle) themeToggle.innerText = '☀️';
    }
}

if(themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.innerText = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerText = '☀️';
        }
    });
}

// ==========================================
// 2. TÌM KIẾM NHANH (LIVE SEARCH)
// ==========================================
const searchInput = document.getElementById('searchInput');
if(searchInput) {
    searchInput.addEventListener('input', function() {
        const filter = this.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        
        // Lọc trong TOC
        const tocItems = document.querySelectorAll('.toc-item');
        tocItems.forEach(item => {
            const text = item.innerText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if(text.includes(filter)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });

        // Lọc trong Sections (Các bài hướng dẫn)
        const sections = document.querySelectorAll('.section');
        sections.forEach(sec => {
            const text = sec.innerText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if(text.includes(filter)) {
                sec.style.display = 'grid';
            } else {
                sec.style.display = 'none';
            }
        });
    });
}

// ==========================================
// 3. NÚT BACK TO TOP
// ==========================================
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.remove('opacity-0', 'translate-y-20');
        backToTop.classList.add('opacity-100', 'translate-y-0');
    } else {
        backToTop.classList.add('opacity-0', 'translate-y-20');
        backToTop.classList.remove('opacity-100', 'translate-y-0');
    }
});

// ==========================================
// 4. LIGHTBOX XEM ẢNH PHÓNG TO
// ==========================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

function initLightbox() {
    const images = document.querySelectorAll('.section-body img');
    images.forEach(img => {
        img.addEventListener('click', function() {
            lightboxImg.src = this.src;
            lightbox.classList.remove('hidden');
            // Cần 1 chút timeout để transition CSS chạy
            setTimeout(() => {
                lightbox.classList.remove('opacity-0');
                lightboxImg.classList.remove('scale-95');
                lightboxImg.classList.add('scale-100');
            }, 10);
        });
    });
}

function closeLightbox() {
    lightbox.classList.add('opacity-0');
    lightboxImg.classList.add('scale-95');
    lightboxImg.classList.remove('scale-100');
    setTimeout(() => {
        lightbox.classList.add('hidden');
        lightboxImg.src = '';
    }, 300); // Bằng thời gian transition CSS
}
