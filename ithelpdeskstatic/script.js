// ==========================================
// TOC PAGINATION — Mục lục có nút ← →
// ==========================================
// Để thêm mục mới, chỉ cần thêm 1 dòng vào mảng này:
const TOC_ITEMS = [
    { num: 1, id: 's1', text: 'Kết nối WiFi (iOS & Android)' },
    { num: 2, id: 's2', text: 'Kết nối VPN Global' },
    { num: 3, id: 's3', text: 'Cài đặt lại MFA (QR Code)' },
    { num: 4, id: 's4', text: 'Cài đặt ứng dụng PVGAS' },
    { num: 5, id: 's5', text: 'Cài đặt Microsoft Teams' },
    { num: 6, id: 's6', text: 'Đăng nhập ngoài công ty' },
    { num: 7, id: 's7', text: 'Archive email & kiểm tra mail' },
    { num: 8, id: 's8', text: 'Thiết bị phòng họp (Polycom)' },
    { num: 9, id: 's9', text: 'Tạo lịch họp Teams' },
    { num: 10, id: 's10', text: 'Kiểm tra bộ gõ tiếng Việt' },
    { num: 11, id: 's11', text: 'Kết nối họp UCKC tại TTĐĐK' },
    // { num: 12, id: 's12', text: 'Tên mục 12 của bạn' },
];
const TOC_PER_PAGE = 12; // Mỗi trang hiển thị tối đa 10 mục (5 hàng × 2 cột)
let tocCurrentPage = 0;

function renderTocPage() {
    const grid = document.getElementById('tocGrid');
    if (!grid) return;

    const searchVal = document.getElementById('searchInput') ? document.getElementById('searchInput').value.trim() : '';

    let itemsToShow;
    if (searchVal) {
        // Khi đang tìm kiếm: hiển thị tất cả mục khớp từ khóa (bỏ qua pagination)
        const filter = searchVal.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        itemsToShow = TOC_ITEMS.filter(item =>
            item.text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(filter)
        );
        // Ẩn thanh pagination khi đang search
        const pagination = document.getElementById('tocPagination');
        if (pagination) pagination.style.display = 'none';
    } else {
        // Chế độ bình thường: phân trang
        const start = tocCurrentPage * TOC_PER_PAGE;
        itemsToShow = TOC_ITEMS.slice(start, start + TOC_PER_PAGE);
        const totalPages = Math.ceil(TOC_ITEMS.length / TOC_PER_PAGE);
        const pagination = document.getElementById('tocPagination');
        const pageInfo = document.getElementById('tocPageInfo');
        const prevBtn = document.getElementById('tocPrevBtn');
        const nextBtn = document.getElementById('tocNextBtn');
        if (pagination) pagination.style.display = totalPages > 1 ? 'flex' : 'none';
        if (pageInfo) pageInfo.textContent = 'Trang ' + (tocCurrentPage + 1) + ' / ' + totalPages;
        if (prevBtn) prevBtn.disabled = tocCurrentPage === 0;
        if (nextBtn) nextBtn.disabled = tocCurrentPage >= totalPages - 1;
    }

    // Render HTML các ô mục lục
    let html = itemsToShow.map(function (item) {
        return '<div class="toc-item" onclick="toggle(\'' + item.id + '\')">' +
            '<div class="toc-num">' + item.num + '</div>' +
            '<div class="toc-text">' + item.text + '</div>' +
            '</div>';
    }).join('');

    // Nếu số ô lẻ, thêm ô trống giữ layout 2 cột
    if (itemsToShow.length % 2 !== 0) {
        html += '<div class="toc-item" style="background:transparent;cursor:default;"></div>';
    }

    grid.innerHTML = html;
}

function changeTocPage(direction) {
    const totalPages = Math.ceil(TOC_ITEMS.length / TOC_PER_PAGE);
    tocCurrentPage = Math.max(0, Math.min(tocCurrentPage + direction, totalPages - 1));
    renderTocPage();
}

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
    if (modal) modal.classList.remove('hidden');
}

function closeZaloModal() {
    if (modal) modal.classList.add('hidden');
}

// Đóng popup khi click ra ngoài vùng trắng
if (modal) {
    modal.addEventListener('click', function (e) {
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
    'P1504': `
 <strong>Họp trực tuyến qua hệ thống Video Conference:</strong>
    <br>Bước 1: Sử dụng remote hoặc màn hình điều khiển Crestron bật máy chiếu.
    <br>Bước 2: Sử dụng remote Polycom hoặc màn hình điều khiển Crestron call tới địa chỉ <strong>1504@10 . 2 . 84 . 10</strong>(viết liền khi nhập)
    <br>Bước 3: Kết nối dây HDMI vào máy tính cá nhân nếu cần trình chiếu.
 `,
    'p1505': `
 <strong>Lưu ý: Không có thiết bị họp trực tuyến.</strong>
  <br>Bước 1: Sử dụng remote máy chiếu chọn cổng INPUT C.
  <br>Bước 2: Trên máy tính nhấn tổ hợp phím WINDOWS + K, chọn device "Meeting Room 5-15F".
 `,
    'p1506': `
<strong>Họp trực tuyến qua MS Teams, Zoom,...:</strong>
<br>Bước 1: Sử dụng remote bật tivi.
<br>Bước 2: Kết nối phần cứng cắm các cổng tín hiệu: HDMI, USB vào máy tính.
<br>Bước 3: Truy cập link cuộc họp, kiểm tra Camera và Âm thanh.
<br>Bước 4: Cấu hình thông số:
<br>Camera: Chọn device là Logitech Meetup.
<br>Âm thanh: Chọn device là Echo Cancelling Speakerphone (Logitech MeetUp Speakerphone).
 `,
    'p1507': `
 <strong>Họp trực tuyến qua hệ thống Video Conference:</strong>
 <br>Bước 1: Sử dụng thiết bị cảm ứng điều khiển, thực hiện quay số tới địa chỉ: <strong>1507@10 . 2 . 84 . 10</strong>(viết liền khi nhập)
 <br>Bước 2: Kết nối dây HDMI vào máy tính nếu cần trình chiếu.
 <br><strong>Họp trực tuyến qua MS Teams, Zoom:</strong>
 <br>Bước 1: Kết nối phần cứng cắm các cổng tín hiệu: HDMI, USB.
 <br>Bước 3: Truy cập link cuộc họp, kiểm tra thiết bị.
 <br>Bước 4: Cấu hình thông số: Camera & Âm thanh chọn nguồn tín hiệu USB PnP Camera/Audio.
 `,
    'p1509': `
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
    if (roomPHModal) roomPHModal.style.display = 'flex';
    backToRoomList(); // Reset về danh sách khi mở
}

// Đóng tất cả
function closeAllModals() {
    if (roomPHModal) roomPHModal.style.display = 'none';
    if (zaloModal) zaloModal.style.display = 'none';
}

// Hiện hướng dẫn chi tiết
function showGuide(roomId) {
    if (roomList) roomList.style.display = 'none';
    if (guideDetail) guideDetail.style.display = 'block';
    if (guideText) guideText.innerHTML = guides[roomId];
    if (roomTitle) roomTitle.innerText = "Thông tin hướng dẫn";
}

// Quay lại danh sách phòng
function backToRoomList() {
    if (roomList) roomList.style.display = 'flex';
    if (guideDetail) guideDetail.style.display = 'none';
    if (roomTitle) roomTitle.innerText = "Chọn phòng họp cần hỗ trợ";
}

// Click ra ngoài để đóng
window.onclick = function (event) {
    if (event.target == roomPHModal || event.target == zaloModal) {
        closeAllModals();
    }
}

function toggle(id) {
    var sec = document.getElementById('sec-' + id);
    var chev = document.getElementById('chev-' + id);

    if (!sec) return;

    var isOpen = sec.classList.contains('open');
    sec.classList.toggle('open', !isOpen);
    if (chev) chev.classList.toggle('open', !isOpen);

    if (!isOpen) {
        // Đợi animation mở xong rồi mới cuộn trang cho mượt (tương ứng với thời gian transition CSS)
        setTimeout(function () { sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 400);
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
    if (progressBar) progressBar.style.width = currentProgress + '%';
    // Cập nhật text theo mốc %
    const targetStep = Math.floor(currentProgress / 25);
    if (targetStep > stepIndex && stepIndex < steps.length - 1) {
        stepIndex = targetStep;
        if (statusText) statusText.innerText = steps[stepIndex];
    }
    if (currentProgress < 100) {
        setTimeout(updateLoading, 300 + Math.random() * 400);
    } else {
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.classList.add('fade-out');
                // Xóa hẳn khỏi DOM sau khi ẩn để nhẹ máy
                setTimeout(() => loadingScreen.remove(), 800);
            }
        }, 800);
    }
};

// images
let imageStates = {}; // Lưu trữ base64 của các ảnh hiện tại
let baseData = {}; // Lưu trữ dữ liệu gốc từ data.json

// Bắt đầu chạy sau khi trang load
window.addEventListener('load', () => {
    updateLoading();
    initDarkMode();
    renderTocPage(); // Khởi tạo mục lục có pagination

    // Khôi phục dữ liệu ảnh đã lưu
    loadSavedImages().then(() => {
        // Chỉ kích hoạt tính năng thêm/đổi ảnh nếu đang ở trang admin.html
        if (window.location.pathname.includes('admin.html')) {
            initImageUploads();
            createAdminPanel();
        }

        initLightbox();
    });
});

// ==========================================
// 5. THÊM HÌNH ẢNH TRỰC TIẾP TRÊN TRANG
// ==========================================
function initImageUploads() {
    // Chỉ chọn các ảnh nằm trong section-body (các bước hướng dẫn), bỏ qua lightbox
    const images = document.querySelectorAll('.section-body img:not(#lightboxImg)');

    images.forEach(img => {
        // Nếu ảnh này đã có wrapper (tránh chạy 2 lần)
        if (img.parentElement.classList.contains('img-preview-container')) return;

        // Tạo khung chứa wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'image-upload-wrapper';
        wrapper.style.margin = '12px 0';

        // Chèn wrapper vào trước image trong DOM
        img.parentNode.insertBefore(wrapper, img);

        // Input file ẩn
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.className = 'hidden';

        // Container chứa các nút bấm
        const btnContainer = document.createElement('div');
        btnContainer.className = 'flex gap-2 mb-3';

        // Icon SVG
        const addIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
        const changeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>';
        const removeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';

        // Kiểm tra xem ảnh gốc có src không để xác định trạng thái ban đầu
        // Chúng ta sẽ cho phép bắt đầu với giao diện rỗng để người dùng tự thêm hình
        // Lưu lại src gốc phòng hờ
        const originalSrc = img.src;
        // Ẩn ảnh đi để tạo giao diện khung trống (đợi user upload)
        img.src = '';

        // Nút Thêm / Đổi ảnh
        const addBtn = document.createElement('button');
        addBtn.className = 'bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 px-3 py-1.5 rounded text-sm transition flex items-center gap-1.5 font-medium shadow-sm';
        addBtn.innerHTML = addIcon + ' <span>Thêm hình ảnh</span>';
        addBtn.onclick = () => fileInput.click();

        // Nút Xóa ảnh
        const removeBtn = document.createElement('button');
        removeBtn.className = 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded text-sm transition flex items-center gap-1.5 font-medium shadow-sm';
        removeBtn.innerHTML = removeIcon + ' <span>Xóa ảnh</span>';
        removeBtn.style.display = 'none'; // Mặc định ẩn vì chưa có ảnh

        btnContainer.appendChild(addBtn);
        btnContainer.appendChild(removeBtn);

        wrapper.appendChild(fileInput);
        wrapper.appendChild(btnContainer);

        // Khung bọc ảnh
        const previewContainer = document.createElement('div');
        previewContainer.className = 'img-preview-container relative inline-block';
        previewContainer.style.display = 'none'; // Ẩn khung ảnh ban đầu

        wrapper.appendChild(previewContainer);
        // Đưa ảnh gốc vào trong container
        previewContainer.appendChild(img);

        // Thêm một số style cho ảnh để trông đẹp hơn
        if (!img.classList.contains('rounded')) img.classList.add('rounded');
        img.classList.add('shadow-md', 'border', 'border-gray-200');

        // Cập nhật giao diện nếu ảnh đã được load từ localStorage/JSON
        const updateUIForSavedImage = () => {
            const index = Array.from(images).indexOf(img);
            if (imageStates[index]) {
                img.src = imageStates[index];
                previewContainer.style.display = 'block';
                removeBtn.style.display = 'flex';
                addBtn.innerHTML = changeIcon + ' <span>Đổi ảnh khác</span>';
            }
        };
        // Chạy hàm kiểm tra ngay sau khi tạo
        updateUIForSavedImage();

        // Xử lý sự kiện khi chọn file
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64 = event.target.result;
                    img.src = base64;

                    // Lưu vào state và localStorage
                    const index = Array.from(images).indexOf(img);
                    imageStates[index] = base64;
                    saveToLocalStorage();

                    previewContainer.style.display = 'block';
                    removeBtn.style.display = 'flex';
                    addBtn.innerHTML = changeIcon + ' <span>Đổi ảnh khác</span>';
                };
                reader.readAsDataURL(file);
            }
        });

        // Xử lý sự kiện khi xóa ảnh
        removeBtn.addEventListener('click', () => {
            img.src = '';
            fileInput.value = '';
            previewContainer.style.display = 'none';
            removeBtn.style.display = 'none';
            addBtn.innerHTML = addIcon + ' <span>Thêm hình ảnh</span>';

            // Xóa khỏi state và localStorage
            const index = Array.from(images).indexOf(img);
            // Thay vì xóa hẳn, ta gán thành chuỗi rỗng để ghi đè baseData
            imageStates[index] = '';
            saveToLocalStorage();
        });
    });
}

function saveToLocalStorage() {
    try {
        // Chỉ lưu những ảnh có sự thay đổi so với data.json (ảnh mới thêm hoặc bị xóa)
        const changesToSave = {};
        for (const key in imageStates) {
            if (imageStates[key] !== baseData[key]) {
                changesToSave[key] = imageStates[key];
            }
        }
        localStorage.setItem('helpdesk_images', JSON.stringify(changesToSave));
    } catch (e) {
        console.warn("Local storage quota exceeded");
        alert("Dung lượng bộ nhớ đã đầy do ảnh quá lớn! Hãy dùng tính năng Xuất file JSON để lưu trữ.");
    }
}

function loadSavedImages() {
    const images = document.querySelectorAll('.section-body img:not(#lightboxImg)');

    // 1. Tải data.json từ server trước
    return fetch('data.json')
        .then(res => {
            if (res.ok) return res.json();
            return {};
        })
        .then(data => {
            if (data && Object.keys(data).length > 0) {
                baseData = data;
                Object.assign(imageStates, data);
            }
            
            // 2. Sau đó tải localStorage đè lên (nếu có ảnh nào mới thêm chưa export)
            const localData = localStorage.getItem('helpdesk_images');
            if (localData) {
                try {
                    const parsed = JSON.parse(localData);
                    Object.assign(imageStates, parsed);
                } catch (e) { }
            }
            
            applyImageData(images);
        })
        .catch(err => {
            // Nếu không có data.json, chỉ dùng localStorage
            const localData = localStorage.getItem('helpdesk_images');
            if (localData) {
                try {
                    const parsed = JSON.parse(localData);
                    Object.assign(imageStates, parsed);
                    applyImageData(images);
                } catch (e) { }
            }
        });
}

function applyImageData(images) {
    images.forEach((img, index) => {
        if (imageStates[index]) {
            img.src = imageStates[index];
            // Đảm bảo ảnh hiển thị trên trang index.html
            img.style.display = 'block';
        }
    });
}

// Bảng điều khiển Admin để Xuất/Nhập JSON
function createAdminPanel() {
    const panel = document.createElement('div');
    panel.className = 'fixed bottom-6 left-6 bg-white p-4 rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col gap-2 transition-all';
    panel.innerHTML = `
        <div class="flex justify-between items-center mb-1 border-b pb-1">
            <h3 class="text-sm font-bold text-gray-700">🛠️ Công cụ Admin</h3>
        </div>
        <button id="btnExportJson" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition font-medium text-left flex items-center gap-2">
            <span>💾</span> Tải xuống JSON
        </button>
        <button id="btnImportJson" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition font-medium text-left flex items-center gap-2" onclick="document.getElementById('importJsonInput').click()">
            <span>📂</span> Tải lên JSON
        </button>
        <button id="btnClearData" class="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded text-sm transition font-medium text-left flex items-center gap-2 mt-2">
            <span>🗑️</span> Xóa dữ liệu tạm
        </button>
        <input type="file" id="importJsonInput" accept=".json" class="hidden">
        <p class="text-[10px] text-gray-400 mt-1 max-w-[150px] leading-tight">Dữ liệu được tự động lưu tạm trên trình duyệt.</p>
    `;
    document.body.appendChild(panel);

    // Xử lý Xuất JSON
    document.getElementById('btnExportJson').addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(imageStates));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "data.json");
        dlAnchorElem.click();
        dlAnchorElem.remove();
    });

    // Xử lý Nhập JSON
    document.getElementById('importJsonInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                localStorage.setItem('helpdesk_images', JSON.stringify(parsed));
                alert("Đã tải dữ liệu thành công! Trang sẽ tự tải lại.");
                location.reload();
            } catch (err) {
                alert("File JSON không hợp lệ!");
            }
        };
        reader.readAsText(file);
    });

    // Xử lý Xóa dữ liệu
    document.getElementById('btnClearData').addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn xóa toàn bộ dữ liệu ảnh đang làm việc?')) {
            localStorage.removeItem('helpdesk_images');
            location.reload();
        }
    });
}

// ==========================================
// 1. CHẾ ĐỘ TỐI (DARK MODE)
// ==========================================
const themeToggle = document.getElementById('themeToggle');

function initDarkMode() {
    // Kiểm tra trạng thái đã lưu
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.innerText = '☀️';
    }
}

if (themeToggle) {
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
if (searchInput) {
    searchInput.addEventListener('input', function () {
        const filter = this.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        // Re-render mục lục theo từ khóa tìm kiếm (tích hợp pagination)
        renderTocPage();

        // Lọc trong TOC (áp dụng sau khi renderTocPage đã vẽ lại)
        const tocItems = document.querySelectorAll('.toc-item');
        tocItems.forEach(item => {
            const text = item.innerText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (text.includes(filter)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });

        // Lọc trong Sections (Các bài hướng dẫn)
        const sections = document.querySelectorAll('.section');
        sections.forEach(sec => {
            const text = sec.innerText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (text.includes(filter)) {
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
        img.addEventListener('click', function () {
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
