// ==========================================================================
// APAG Shell Layout Component
// Integrates Sidebar, Top Navbar, Content Area, AI Assistant Drawer & Modals
// ==========================================================================

import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { AiChatWidget } from './AiChatWidget';

export const AppLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--background)' }}>
        <div style={{ textAlign: 'center' }}>
          <img src="/assets/images/apag-logo.png" alt="APAG" style={{ height: '40px', marginBottom: '16px' }} />
          <div className="text-secondary" style={{ fontSize: '0.875rem' }}>Đang nạp dữ liệu APAG...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Derive human-readable page title from path
  const getPageTitle = (pathname: string): string => {
    if (pathname.includes('/student/dashboard')) return 'Tổng quan kết quả học tập';
    if (pathname.includes('/student/profile')) return 'Hồ sơ học tập sinh viên';
    if (pathname.includes('/student/progress')) return 'Tiến độ tích lũy & Điều kiện tốt nghiệp';
    if (pathname.includes('/student/curriculum')) return 'Chương trình đào tạo đại học';
    if (pathname.includes('/student/grades')) return 'Bảng điểm & Kết quả học tập';
    if (pathname.includes('/student/learning-path')) return 'Lập kế hoạch học tập cá nhân';
    if (pathname.includes('/student/timetable')) return 'Thời khóa biểu & Kế hoạch học tập';
    if (pathname.includes('/student/alerts')) return 'Thông báo & Cảnh báo học vụ';
    if (pathname.includes('/student/ai-assistant')) return 'Trợ lý học thuật AI';
    if (pathname.includes('/student/notifications')) return 'Hộp thư thông báo học vụ';
    if (pathname.includes('/student/settings')) return 'Cài đặt hệ thống';

    if (pathname.includes('/advisor/dashboard')) return 'Bàn làm việc Cố vấn Học tập';
    if (pathname.includes('/advisor/students')) return 'Quản lý sinh viên lớp phụ trách';
    if (pathname.includes('/advisor/student-detail')) return 'Chi tiết hồ sơ học vụ sinh viên';
    if (pathname.includes('/advisor/progress')) return 'Giám sát tiến độ tích lũy tín chỉ';
    if (pathname.includes('/advisor/learning-paths')) return 'Phê duyệt lộ trình học tập';
    if (pathname.includes('/advisor/alerts')) return 'Radar cảnh báo sớm sinh viên rủi ro';
    if (pathname.includes('/advisor/reports')) return 'Báo cáo thống kê học vụ chuyên sâu';
    if (pathname.includes('/advisor/ai-assistant')) return 'Trợ lý học thuật AI';
    if (pathname.includes('/advisor/notifications')) return 'Phát thông báo lớp học';
    if (pathname.includes('/advisor/settings')) return 'Cài đặt thông tin cố vấn';

    if (pathname.includes('/admin/dashboard')) return 'Bàn làm việc Quản trị Đào tạo';
    if (pathname.includes('/admin/students')) return 'Cơ sở dữ liệu sinh viên toàn trường';
    if (pathname.includes('/admin/courses')) return 'Danh mục học phần & Tiên quyết';
    if (pathname.includes('/admin/curriculum')) return 'Quản lý khung chương trình đào tạo';
    if (pathname.includes('/admin/users')) return 'Quản trị người dùng & Phân quyền';
    if (pathname.includes('/admin/knowledge-base')) return 'Cơ sở tri thức RAG & Quy chế';
    if (pathname.includes('/admin/regulations')) return 'Văn bản quy định & Chính sách';
    if (pathname.includes('/admin/ai-agent')) return 'Cấu hình tham số AI Agent';
    if (pathname.includes('/admin/reports')) return 'Báo cáo tổng hợp toàn viện';
    if (pathname.includes('/admin/system')) return 'Tham số năm học & Hệ thống';
    if (pathname.includes('/admin/settings')) return 'Cài đặt hệ thống quản trị';

    return 'APAG SIS | Hệ thống cố vấn thông minh';
  };

  return (
    <div className={`app-shell ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar 
        isCollapsed={isCollapsed} 
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div className="main-wrapper">
        <Navbar 
          onToggleMobileSidebar={() => setIsMobileOpen(!isMobileOpen)} 
          pageTitle={getPageTitle(location.pathname)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
        <main className="page-content" id="pageMainContent">
          <Outlet />
        </main>
      </div>

      {/* Floating AI Chat Assistant */}
      <AiChatWidget />

      {/* Toast Notification Mount Point */}
      <div id="toast-root" className="toast-container"></div>
    </div>
  );
};
