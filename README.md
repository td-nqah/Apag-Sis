# APAG SIS – Hệ thống Quản trị Đào tạo & Cố vấn Học vụ Thông minh
### Smart Academic Advisory & Student Information System (v2.0.0)

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.17-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![WCAG AA](https://img.shields.io/badge/Accessibility-WCAG%20AA%20Compliant-047857)](https://www.w3.org/WAI/WCAG2AA-Conformance)
[![Thông tư](https://img.shields.io/badge/Quy%20chế-08%2F2021%2FTT--BGDĐT-1D4ED8)](https://moet.gov.vn/)

> **Kiến trúc:** Frontend Single Page Application (SPA) hiệu năng cao – Tối ưu hóa trải nghiệm người dùng theo tiêu chuẩn giáo dục đại học – Sẵn sàng tích hợp API Backend.  
> **Repository:** [https://github.com/td-nqah/Apag-Sis.git](https://github.com/td-nqah/Apag-Sis.git) (Branch `main` tự động triển khai Vercel Production).

---

## 📌 Mục lục
- [1. Giới thiệu Dự án](#1-giới-thiệu-dự-án)
- [2. Hệ thống Thiết kế & Chuẩn UI/UX (Design System)](#2-hệ-thống-thiết-kế--chuẩn-uiux-design-system)
- [3. Chuẩn hóa Khảo thí & Quy thức Văn bản Hành chính](#3-chuẩn-hóa-khảo-thí--quy-thức-văn-bản-hành-chính)
- [4. Các Phân hệ Chức năng (RBAC Modules)](#4-các-phân-hệ-chức-năng-rbac-modules)
- [5. Cấu trúc Thư mục Dự án](#5-cấu-trúc-thư-mục-dự-án)
- [6. Hướng dẫn Khởi chạy & Kiểm thử](#6-hướng-dẫn-khởi-chạy--kiểm-thử)
- [7. Tài khoản Đăng nhập Demo](#7-tài-khoản-đăng-nhập-demo)
- [8. Hướng dẫn Tích hợp Backend (API Integration Guide)](#8-hướng-dẫn-tích-hợp-backend-api-integration-guide)

---

## 1. Giới thiệu Dự án

**APAG SIS** là nền tảng quản trị đào tạo và cố vấn học tập số thế hệ mới, giải quyết triệt để bài toán theo dõi tiến độ tích lũy, phát hiện sớm nguy cơ học vụ và đồng hành cùng sinh viên trong suốt lộ trình đào tạo theo hệ thống tín chỉ.

Hệ thống được thiết kế hướng tới 3 nhóm người dùng cốt lõi:
1. **Sinh viên:** Chủ động kiểm soát kết quả học tập, mô phỏng GPA tương lai, nắm bắt điều kiện tiên quyết của học phần và tương tác với Trợ lý AI học thuật.
2. **Cố vấn học tập (CVHT):** Nắm bắt hồ sơ học tập 360°, nhận diện sinh viên cần can thiệp qua radar cảnh báo học vụ, soạn thảo kế hoạch hỗ trợ cá nhân hóa.
3. **Phòng Quản lý Đào tạo:** Quản lý tập trung khung chương trình đào tạo, sinh viên, sổ điểm điện tử, xử lý học vụ theo đúng quy chế đào tạo đại học hiện hành.

---

## 2. Hệ thống Thiết kế & Chuẩn UI/UX (Design System)

Hệ thống tuân thủ nghiêm ngặt các nguyên tắc thiết kế hiện đại, đạt độ hoàn thiện cao (anti-slop, intentional design) và chuẩn trợ năng toàn cầu:

### 2.1. Typography & Sàn kích thước chữ (Font Floor)
- **Cặp Font tối ưu tiếng Việt:**
  - `Plus Jakarta Sans`: Sử dụng cho tiêu đề, số liệu thống kê nổi bật, headline.
  - `Be Vietnam Pro`: Sử dụng cho thân bài, nhãn bảng biểu, nội dung văn bản.
  - Fallback an toàn: `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`.
- **Sàn kích thước chữ:**
  - Tuyệt đối không sử dụng kích thước dưới `12px` (`0.75rem`).
  - Toàn bộ chữ chức năng (nút bấm, nhãn input, thông tin giảng viên, địa chỉ văn phòng, mã học phần): tối thiểu `14px` (`0.875rem`) với `line-height: 1.5–1.55`.

### 2.2. Nhận diện Thương hiệu & Chuẩn Tương phản WCAG AA
- **Màu chủ đạo APAG:** Sử dụng tông **Royal Blue** (`--primary: #1D4ED8`, `--primary-light: #EFF6FF`, `--primary-hover: #1E40AF`).
- **Loại bỏ AI Gradient Slop:** Trợ lý học thuật AI và các huy hiệu thông minh sử dụng màu thương hiệu APAG nhất quán thay vì màu tím/xanh gradient quen thuộc trên thị trường.
- **Tương phản đạt chuẩn WCAG AA (≥ 4.5:1):**
  - Trạng thái Thành công/Đạt: `--success: #047857`, nền `--success-light: #ECFDF5`, chữ `--success-text: #064E3B`.
  - Trạng thái Cảnh báo: `--warning: #B45309`, nền `--warning-light: #FFFBEB`.
  - Trạng thái Nguy cơ/Xử lý: `--danger: #B91C1C`, nền `--danger-light: #FEF2F2`.

### 2.3. Hiệu năng & Motion không giật Layout (Zero Layout Shift)
- Toàn bộ thanh tiến độ (Progress bar) và hiệu ứng chuyển động không sử dụng `transition: width/height`.
- Chuyển hoàn toàn sang GPU-accelerated: `transform: scaleX(...)`, `transform-origin: left`, `opacity` và `will-change: transform`.

### 2.4. Bố cục Card & Bảng dữ liệu sạch (Anti-clutter Layout)
- **Bỏ viền trái dày (side-tab borders):** Thẻ thông báo, sự kiện lịch học, khối khuyến nghị sử dụng nền trung tính nhạt kết hợp chấm trạng thái tròn tinh tế (8px status dot) hoặc chip trạng thái.
- **Xóa bỏ thẻ lồng thẻ (nested card containers):** Các bảng dữ liệu (Bảng điểm, Tiến độ tích lũy, Danh sách sinh viên) nằm trực tiếp trong card duy nhất, padding ô bảng tối thiểu `12px 16px`, cột nội dung dài tự động xuống dòng và có giới hạn độ rộng hợp lý.

---

## 3. Chuẩn hóa Khảo thí & Quy thức Văn bản Hành chính

1. **Chuẩn hóa Thuật ngữ theo Thông tư 08/2021/TT-BGDĐT:**
   - Sử dụng thống nhất **"học phần"** (thay cho "môn học").
   - Trạng thái đăng ký: **"đủ điều kiện đăng ký"** (thay cho "mở khóa").
   - Xử lý vi phạm/học vụ: **"xử lý học vụ"**, **"cảnh báo học vụ"**, **"buộc thôi học"** theo đúng quy chế khảo thí.
2. **Quy thức Văn bản Hành chính (Thư Thông báo Học vụ):**
   - Áp dụng chuẩn thể thức văn bản: Thụt đầu dòng đoạn văn `1.27cm` (`text-indent: 1.27cm`).
   - Căn lề đều hai bên (`text-align: justify; line-height: 1.6`).
   - Giới hạn chiều rộng khối đọc tối ưu từ 65–75 ký tự (`max-width: 720px`).
   - Chuẩn gạch đầu dòng hành chính: Sử dụng dấu gạch ngang en-dash (`–`) chuẩn thể thức văn bản, không sử dụng dấu chấm tròn (bullet).

---

## 4. Các Phân hệ Chức năng (RBAC Modules)

### 🎓 4.1. Phân hệ Sinh viên (`/student/*`)
- **Tổng quan kết quả (`/student/dashboard`):** Thẻ sinh viên điện tử (mã QR/barcode), GPA tích lũy, số tín chỉ hoàn thành, radar cảnh báo và các mốc hạn học vụ quan trọng.
- **Bảng điểm & Kết quả (`/student/grades`):** Tra cứu điểm từng học kỳ, điểm hệ 10, hệ 4, điểm chữ, tính năng mô phỏng GPA dự kiến.
- **Tiến độ tích lũy (`/student/progress`):** Thống kê hoàn thành theo khối kiến thức (Đại cương, Cơ sở ngành, Chuyên ngành, Thực tập/Khóa luận tốt nghiệp).
- **Lộ trình học tập & Cây tiên quyết (`/student/learning-paths`):** Trực quan hóa cây điều kiện tiên quyết của các học phần qua component tương tác `SkillTree`.
- **Học phần & Khung CTĐT (`/student/curriculum`):** Danh mục học phần, đề cương chi tiết, số tín chỉ, học phần tiên quyết/song hành.
- **Thời khóa biểu & Lịch thi (`/student/timetable`):** Lịch học theo tuần/ngày, phòng học, giảng viên, ca thi và vị trí phòng thi.
- **Hộp thư thông báo (`/student/notifications`):** Thông báo học vụ, thông báo cảnh báo từ CVHT, hỗ trợ đánh dấu đã đọc và lọc theo phân loại.
- **Cảnh báo học vụ (`/student/alerts`):** Chi tiết mức độ rủi ro, khuyến nghị khắc phục và liên kết cố vấn.
- **Trợ lý học thuật AI (`/student/ai-assistant`):** Giải đáp quy chế đào tạo, tư vấn đăng ký học phần, giải thích điều kiện tiên quyết.

### 👨‍🏫 4.2. Phân hệ Cố vấn học tập (`/advisor/*`)
- **Dashboard Cố vấn (`/advisor/dashboard`):** Biểu đồ phân bổ xếp loại học lực, phân loại sinh viên theo nguy cơ cảnh báo, việc cần xử lý trong tuần.
- **Danh sách Sinh viên Quản lý (`/advisor/students`):** Bộ lọc đa tiêu chí (khóa, ngành, GPA, tình trạng học vụ), xem hồ sơ 360° từng sinh viên.
- **Chi tiết Sinh viên 360° (`/advisor/students/:id`):** Toàn bộ lịch sử điểm số, xu hướng GPA qua các kỳ, ghi chú tư vấn, nhật ký can thiệp.
- **Radar Cảnh báo Học vụ (`/advisor/alerts`):** Danh sách sinh viên thuộc diện cảnh báo mức 1, mức 2, nguy cơ buộc thôi học; công cụ gửi cảnh báo hàng loạt.
- **Phê duyệt Lộ trình (`/advisor/learning-paths`):** Xem xét và phê duyệt kế hoạch đăng ký học phần cá nhân của sinh viên.
- **Trợ lý AI Cố vấn (`/advisor/ai-assistant`):** Tự động phân tích nguyên nhân kết quả giảm sút, gợi ý mẫu thư tư vấn và kế hoạch can thiệp phù hợp.

### 🏛️ 4.3. Phân hệ Quản trị Đào tạo (`/admin/*`)
- **Dashboard Quản trị (`/admin/dashboard`):** Bức tranh toàn cảnh về quy mô đào tạo, tỷ lệ sinh viên tốt nghiệp đúng hạn, tỷ lệ cảnh báo toàn trường.
- **Quản lý Sinh viên (`/admin/students`):** Thêm mới, chỉnh sửa trạng thái sinh viên (Đang học, Nghỉ học tạm thời, Xử lý học vụ, Tốt nghiệp).
- **Sổ điểm Điện tử (`/admin/grades`):** Quản lý điểm học phần toàn trường, khóa sổ điểm, cấp quyền sửa điểm có lưu audit log.
- **Quản lý Học phần (`/admin/courses`):** Danh mục toàn bộ học phần, mã học phần, số tín chỉ lý thuyết/thực hành, học phần tiên quyết.
- **Khung Chương trình Đào tạo (`/admin/curriculum`):** Cấu hình khung CTĐT cho từng khóa/ngành học.
- **Báo cáo & Thống kê (`/admin/reports`):** Xuất báo cáo điểm rèn luyện, học lực, cảnh báo học vụ ra file Excel (`.xlsx`).
- **Cấu hình Quy chế & Hệ thống (`/admin/system`):** Cấu hình mốc điểm cảnh báo học vụ theo Thông tư 08/2021/TT-BGDĐT, bảo mật và phân quyền tài khoản.

---

## 5. Cấu trúc Thư mục Dự án

```text
APAG Project/
├── css/                                   # Hệ thống Design Tokens & CSS Modules
│   ├── minimal.css                        # CSS Tokens cốt lõi, reset, typography & buttons
│   ├── student.css                        # Style giao diện phân hệ Sinh viên
│   ├── advisor.css                        # Style giao diện phân hệ Cố vấn
│   ├── dashboard.css                      # Style biểu đồ, widget thẻ chỉ số
│   ├── sidebar.css                        # Thanh điều hướng chuẩn sàn 14px
│   ├── ai.css                             # Widget Trợ lý học thuật AI
│   └── responsive.css                     # Tối ưu hiển thị đa thiết bị (Mobile/Tablet/Desktop)
├── public/                                # Tài nguyên tĩnh (Logo APAG, Icons, Favicon)
├── src/
│   ├── main.tsx                           # Điểm khởi chạy ứng dụng
│   ├── App.tsx                            # Cấu hình Routing (React Router v6)
│   ├── types/index.ts                     # Schema TypeScript cho toàn bộ Domain Models
│   ├── context/AuthContext.tsx            # Context quản lý phiên và phân quyền RBAC
│   ├── services/
│   │   ├── authService.ts                 # Service xác thực tài khoản & lưu phiên
│   │   └── mockData.ts                    # Cơ sở dữ liệu mẫu tiêu chuẩn (Mock Database)
│   ├── utils/utils.ts                     # Hàm tiện ích format tiền tệ, ngày tháng, thông báo
│   ├── components/
│   │   ├── common/CommandBar.tsx          # Thanh tra cứu nhanh toàn hệ thống (Ctrl + K)
│   │   ├── layout/                        # AppLayout, Navbar, Sidebar, AiChatWidget
│   │   └── student/SkillTree.tsx          # Component trực quan cây điều kiện tiên quyết
│   └── pages/                             # 31 màn hình chức năng chia theo 3 phân hệ
│       ├── Login.tsx                      # Trang đăng nhập kèm nút chọn nhanh vai trò
│       ├── student/                       # 10 màn hình chức năng sinh viên
│       ├── advisor/                       # 10 màn hình chức năng cố vấn học tập
│       └── admin/                         # 11 màn hình quản trị đào tạo
├── vercel.json                            # Cấu hình định tuyến SPA cho Vercel Production
├── tsconfig.json                          # Cấu hình TypeScript 5 nghiêm ngặt (Strict mode)
├── vite.config.ts                         # Cấu hình đóng gói Vite 6 & Tách nhỏ Chunk
└── package.json                           # Khai báo dependencies tinh gọn
```

---

## 6. Hướng dẫn Khởi chạy & Kiểm thử

### 6.1. Yêu cầu Môi trường
- **Node.js:** Phiên bản `>= 18.0.0` (Khuyến nghị `Node.js 20 LTS`).
- **NPM:** Phiên bản `>= 9.0.0` hoặc **Yarn / PNPM**.

### 6.2. Các Lệnh Thực thi

```bash
# 1. Cài đặt toàn bộ thư viện phụ thuộc
npm install

# 2. Khởi chạy máy chủ phát triển cục bộ
npm run dev
# Truy cập giao diện tại: http://localhost:3000

# 3. Kiểm tra tính toàn vẹn kiểu dữ liệu (TypeScript Typecheck)
npm run typecheck

# 4. Đóng gói bản Production hoàn chỉnh
npm run build
# Thư mục xuất bản: dist/

# 5. Xem trước bản đóng gói Production cục bộ
npm run preview
```

---

## 7. Tài khoản Đăng nhập Demo

Hệ thống tích hợp sẵn nút chọn nhanh tài khoản tại giao diện Đăng nhập (`/login`):

| Vai trò | Tên người dùng | Mật khẩu | Quyền hạn & Chức năng trọng tâm |
| :--- | :--- | :--- | :--- |
| 🎓 **Sinh viên** | `sv_2505httb012` | `123456` | Xem điểm, tiến độ tích lũy, lộ trình học tập, cây tiên quyết, gửi tin nhắn cho CVHT, hỏi Trợ lý AI |
| 👨‍🏫 **Cố vấn học tập** | `gv_nguyennangthanh` | `123456` | Radar cảnh báo học vụ, xem hồ sơ SV 360°, duyệt lộ trình, gửi thông báo can thiệp |
| 🏛️ **Quản trị đào tạo** | `admin_daotao` | `123456` | Quản trị khung CTĐT, danh mục học phần, khóa sổ điểm điện tử, xuất báo cáo khảo thí Excel |

---

## 8. Hướng dẫn Tích hợp Backend (API Integration Guide)

Frontend đã được thiết kế sẵn sàng để cắm trực tiếp vào hệ thống Backend (Node.js/NestJS, Java Spring Boot, Go, Python/FastAPI hoặc .NET Core):

1. **Chuẩn Schema dữ liệu**: Tham chiếu trực tiếp các interface tại [`src/types/index.ts`](file:///src/types/index.ts) để xây dựng DTO và REST API tương thích.
2. **Cấu hình biến môi trường**: Sao chép file `.env.example` thành `.env` và khai báo URL Backend API:
   ```env
   VITE_API_URL=https://api.yourdomain.edu.vn/v1
   ```
3. **Thay thế Mock Service**: Thay thế các hàm gọi dữ liệu trong [`src/services/mockData.ts`](file:///src/services/mockData.ts) bằng `fetch` hoặc `axios` trỏ tới `VITE_API_URL`. Toàn bộ token JWT có thể được lưu trữ và đính kèm tự động thông qua [`src/context/AuthContext.tsx`](file:///src/context/AuthContext.tsx).

---

## 📄 Bản quyền & Đóng góp
Dự án được xây dựng và phát triển phục vụ công tác chuyển đổi số giáo dục đại học. Mọi đóng góp xin vui lòng tạo Pull Request hoặc gửi Issue trực tiếp tại [GitHub Repository](https://github.com/td-nqah/Apag-Sis.git).
