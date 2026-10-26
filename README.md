# APAG SIS - Hệ thống Quản trị Đào tạo & Cố vấn Học vụ Thông minh
### (Smart Academic Advisory & Student Information System)

> **Công nghệ:** React 18 • TypeScript 5 • Vite 6 • React Router v6 • Chart.js • Recharts • Lucide Icons  
> **Kiến trúc:** Frontend Single Page Application (SPA) • Chuẩn hóa theo Thông tư 08/2021/TT-BGDĐT  
> **Mục đích:** Bản Demo Frontend hoàn chỉnh dành cho đối tác/đội ngũ phát triển Backend tích hợp API.

---

## 1. Hướng dẫn Khởi chạy Ứng dụng

```bash
# 1. Cài đặt các gói thư viện
npm install

# 2. Khởi chạy máy chủ phát triển cục bộ
npm run dev
# Mở trình duyệt tại: http://localhost:3000

# 3. Kiểm tra lỗi kiểu dữ liệu TypeScript
npm run typecheck

# 4. Đóng gói bản Production
npm run build
# Kết quả xuất ra thư mục: dist/
```

---

## 2. Cấu trúc Mã nguồn Dự án

```text
APAG Project/
├── src/                                   # TOÀN BỘ MÃ NGUỒN REACT + TYPESCRIPT
│   ├── main.tsx                           # Entry point ứng dụng & nạp CSS
│   ├── App.tsx                            # Cấu hình định tuyến (React Router DOM v6)
│   ├── types/index.ts                     # Định nghĩa kiểu dữ liệu Domain Models
│   ├── context/AuthContext.tsx            # Quản lý phiên đăng nhập & Phân quyền RBAC
│   ├── services/
│   │   ├── authService.ts                 # Service xác thực (Đăng nhập, Session)
│   │   └── mockData.ts                    # Cơ sở dữ liệu Mock chuẩn cho Frontend Demo
│   ├── utils/utils.ts                     # Tiện ích chung (Format, Toast notifications)
│   ├── components/
│   │   ├── common/CommandBar.tsx          # Thanh công cụ tìm kiếm nhanh Ctrl + K
│   │   ├── layout/                        # AppLayout, Navbar, Sidebar, AiChatWidget
│   │   └── student/SkillTree.tsx          # Sơ đồ Cây học phần & Tiên quyết
│   └── pages/                             # 31 Màn hình chức năng hoàn chỉnh
│       ├── Login.tsx                      # Trang đăng nhập demo 3 vai trò
│       ├── student/                       # Phân hệ Sinh viên (10 màn hình)
│       ├── advisor/                       # Phân hệ Cố vấn học tập (10 màn hình)
│       └── admin/                         # Phân hệ Quản trị đào tạo (11 màn hình)
├── css/                                   # Hệ thống thiết kế Soft UI & Neumorphism
├── public/assets/images/                  # Logo APAG, Avatar mặc định, Favicon
├── vercel.json                            # Cấu hình triển khai Vercel (SPA Rewrites)
├── package.json                           # Cấu hình dependencies tinh gọn
├── tsconfig.json                          # Cấu hình TypeScript 5
└── vite.config.ts                         # Cấu hình Vite 6 & Code-splitting
```

---

## 3. Tài khoản Đăng nhập Demo

Hệ thống tích hợp sẵn bộ chuyển đổi vai trò nhanh tại trang Đăng nhập (`/login`):

| Vai trò | Tên người dùng | Mật khẩu | Chức năng chính |
| :--- | :--- | :--- | :--- |
| **Sinh viên** | `sv_2505httb012` | `123456` | Thẻ SV điện tử, Kế hoạch học tập, Giả lập GPA, Trợ lý học thuật AI |
| **Cố vấn học tập** | `gv_nguyennangthanh` | `123456` | Radar cảnh báo học tập, Hồ sơ sinh viên 360°, Phê duyệt lộ trình |
| **Quản trị đào tạo** | `admin_daotao` | `123456` | Sổ điểm điện tử, Khung CTĐT, Quản lý sinh viên toàn viện |

---

## 4. Ghi chú Tích hợp dành cho Đội ngũ Backend

1. **Dữ liệu Mock**: Toàn bộ dữ liệu mẫu, schema học phần, sinh viên, cảnh báo, quy chế đang được tập trung tại [`src/services/mockData.ts`](file:///src/services/mockData.ts) và [`src/types/index.ts`](file:///src/types/index.ts). Backend có thể tham chiếu trực tiếp schema này để thiết kế cơ sở dữ liệu và REST API tương thích.
2. **Cấu hình Endpoint**: File [`.env.example`](file:///./.env.example) đã khai báo sẵn `VITE_API_URL` để sẵn sàng chuyển từ Mock Service sang REST/GraphQL API của Backend khi hoàn tất.