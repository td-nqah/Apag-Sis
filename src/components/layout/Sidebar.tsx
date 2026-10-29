// ==========================================================================
// APAG SIS | Hệ thống cố vấn thông minh - Navigation Sidebar
// ==========================================================================

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Award, 
  Compass, 
  FileText, 
  Sparkles, 
  Users, 
  TrendingUp, 
  FileBarChart, 
  BookOpen, 
  Layers, 
  BarChart3, 
  Sliders,
  Calendar,
  Bell,
  User as UserIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LucideIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavSubItem {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  isAlertBadge?: boolean;
  isAiTag?: boolean;
}

interface NavCategory {
  id: string;
  label: string;
  railIcon: LucideIcon;
  items: NavSubItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onCloseMobile();
    logout();
    navigate('/login');
  };

  // 1. Navigation Definitions per Role
  const studentCategories: NavCategory[] = [
    {
      id: 'overview',
      label: 'Tổng quan',
      railIcon: LayoutDashboard,
      items: [
        { to: '/student/dashboard', label: 'Tổng quan kết quả', icon: LayoutDashboard },
        { to: '/student/notifications', label: 'Hộp thư thông báo', badge: '4', icon: Bell }
      ]
    },
    {
      id: 'academics',
      label: 'Học tập',
      railIcon: Award,
      items: [
        { to: '/student/grades', label: 'Bảng điểm & Kết quả', icon: Award },
        { to: '/student/progress', label: 'Tiến độ tích lũy', icon: TrendingUp },
        { to: '/student/curriculum', label: 'Chương trình đào tạo', icon: Layers }
      ]
    },
    {
      id: 'planning',
      label: 'Kế hoạch',
      railIcon: Compass,
      items: [
        { to: '/student/learning-path', label: 'Lập kế hoạch cá nhân', icon: Compass },
        { to: '/student/timetable', label: 'Thời khóa biểu & Lịch', icon: Calendar }
      ]
    },
    {
      id: 'services',
      label: 'Học vụ',
      railIcon: FileText,
      items: [
        { to: '/student/alerts', label: 'Đơn từ & Cảnh báo', badge: '1', isAlertBadge: true, icon: FileText },
        { to: '/student/profile', label: 'Hồ sơ học vụ SV', icon: UserIcon }
      ]
    },
    {
      id: 'ai',
      label: 'Trợ lý AI',
      railIcon: Sparkles,
      items: [
        { to: '/student/ai-assistant', label: 'Trợ lý học thuật AI', isAiTag: true, icon: Sparkles }
      ]
    }
  ];

  const advisorCategories: NavCategory[] = [
    {
      id: 'overview',
      label: 'Tổng quan',
      railIcon: LayoutDashboard,
      items: [
        { to: '/advisor/dashboard', label: 'Bàn làm việc Cố vấn', icon: LayoutDashboard },
        { to: '/advisor/notifications', label: 'Thông báo lớp học', badge: '3', icon: Bell }
      ]
    },
    {
      id: 'students',
      label: 'Sinh viên',
      railIcon: Users,
      items: [
        { to: '/advisor/students', label: 'Sinh viên phụ trách', badge: '5', isAlertBadge: true, icon: Users },
        { to: '/advisor/student-detail', label: 'Chi tiết hồ sơ SV', icon: UserIcon },
        { to: '/advisor/alerts', label: 'Radar cảnh báo sớm', badge: '5', icon: FileText }
      ]
    },
    {
      id: 'progress',
      label: 'Tiến độ',
      railIcon: TrendingUp,
      items: [
        { to: '/advisor/progress', label: 'Giám sát tích lũy tín chỉ', icon: TrendingUp },
        { to: '/advisor/learning-paths', label: 'Phê duyệt lộ trình', icon: Compass }
      ]
    },
    {
      id: 'reports',
      label: 'Báo cáo',
      railIcon: FileBarChart,
      items: [
        { to: '/advisor/reports', label: 'Báo cáo học vụ chuyên sâu', icon: FileBarChart }
      ]
    },
    {
      id: 'ai',
      label: 'Trợ lý AI',
      railIcon: Sparkles,
      items: [
        { to: '/advisor/ai-assistant', label: 'Trợ lý học thuật AI', isAiTag: true, icon: Sparkles }
      ]
    }
  ];

  const adminCategories: NavCategory[] = [
    {
      id: 'overview',
      label: 'Tổng quan',
      railIcon: LayoutDashboard,
      items: [
        { to: '/admin/dashboard', label: 'Bàn làm việc Quản trị', icon: LayoutDashboard }
      ]
    },
    {
      id: 'academic',
      label: 'Đào tạo',
      railIcon: BookOpen,
      items: [
        { to: '/admin/students', label: 'CSDL Sinh viên toàn viện', icon: Users },
        { to: '/admin/courses', label: 'Danh mục học phần', icon: BookOpen },
        { to: '/admin/curriculum', label: 'Khung chương trình ĐT', icon: Layers }
      ]
    },
    {
      id: 'regulations',
      label: 'Quy chế',
      railIcon: Layers,
      items: [
        { to: '/admin/regulations', label: 'Văn bản quy định & Chính sách', icon: FileText },
        { to: '/admin/knowledge-base', label: 'Cơ sở tri thức RAG & Quy chế', icon: BookOpen }
      ]
    },
    {
      id: 'system',
      label: 'Hệ thống',
      railIcon: Sliders,
      items: [
        { to: '/admin/users', label: 'Người dùng & Phân quyền', icon: Users },
        { to: '/admin/system', label: 'Tham số năm học & Hệ thống', icon: Sliders },
        { to: '/admin/ai-agent', label: 'Cấu hình tham số AI Agent', isAiTag: true, icon: Sparkles }
      ]
    },
    {
      id: 'reports',
      label: 'Báo cáo',
      railIcon: BarChart3,
      items: [
        { to: '/admin/reports', label: 'Báo cáo tổng hợp toàn viện', icon: BarChart3 }
      ]
    }
  ];

  let categories = studentCategories;
  if (user?.role === 'advisor') categories = advisorCategories;
  else if (user?.role === 'admin') categories = adminCategories;

  // Determine active category from current route
  const currentCategory = categories.find(cat => 
    cat.items.some(item => location.pathname === item.to || location.pathname.startsWith(item.to + '/'))
  ) || categories[0];

  const [activeCategoryId, setActiveCategoryId] = useState<string>(currentCategory?.id || 'overview');

  useEffect(() => {
    if (currentCategory && currentCategory.id !== activeCategoryId) {
      setActiveCategoryId(currentCategory.id);
    }
  }, [location.pathname]);

  const dashboardPath = user?.role === 'advisor' ? '/advisor/dashboard' : user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          className="sidebar-mobile-backdrop" 
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside 
        className={`app-dual-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}
        id="appSidebar"
      >
        <div className="nav-panel" id="navPanel">
          {/* Panel Header: Brand Logo & Title */}
          <div className="nav-panel-header">
            <NavLink 
              to={dashboardPath} 
              className="panel-brand"
              onClick={onCloseMobile}
              title="APAG SIS | Hệ thống cố vấn thông minh"
            >
              {isCollapsed ? (
                <div className="panel-logo-collapsed" title="APAG SIS">
                  <span>A</span>
                </div>
              ) : (
                <img 
                  src="/assets/images/apag-logo.png" 
                  alt="APAG SIS Logo" 
                  className="panel-logo"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/images/apag-logo.svg';
                  }}
                />
              )}
            </NavLink>
          </div>

          {/* Grouped Secondary Navigation List */}
          <div className="panel-content" id="panelNavScroll">
            {categories.map((cat, catIdx) => {
              const isSelectedCategory = activeCategoryId === cat.id;

              return (
                <div 
                  key={cat.id} 
                  className={`panel-section ${isSelectedCategory ? 'is-selected-category' : ''}`}
                >
                  {catIdx > 0 && <div className="sidebar-group-divider" />}

                  <div className="panel-section-header">
                    <span className="panel-section-title">{cat.label}</span>
                    <div className="panel-section-header-line" />
                  </div>

                  <ul className="panel-nav-list">
                    {cat.items.map((item) => {
                      const ItemIcon = item.icon;

                      return (
                        <li key={item.to} className="panel-nav-item">
                          <NavLink
                            to={item.to}
                            onClick={onCloseMobile}
                            className={({ isActive }) => `panel-nav-link ${isActive ? 'active' : ''}`}
                            title={item.label}
                          >
                            <span className="panel-link-accent" />
                            <ItemIcon size={18} strokeWidth={1.75} className="panel-item-icon" />
                            <span className="panel-link-text">{item.label}</span>

                            {item.badge && (
                              <span className={`panel-badge ${item.isAlertBadge ? 'badge-alert' : 'badge-default'}`}>
                                {item.badge}
                              </span>
                            )}

                            {item.isAiTag && (
                              <span className="panel-ai-tag">
                                AI
                              </span>
                            )}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Panel Footer: Logout & Collapse Toggle */}
          <div className="panel-footer">
            <button 
              type="button"
              onClick={handleLogout}
              className="panel-footer-btn logout-btn"
              title="Đăng xuất khỏi hệ thống"
            >
              <LogOut size={16} strokeWidth={1.75} />
              <span className="panel-footer-btn-text">Đăng xuất</span>
            </button>

            <button
              type="button"
              className="panel-footer-btn d-none d-lg-flex collapse-toggle-btn"
              onClick={onToggleCollapse}
              title={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
              aria-label={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
            >
              {isCollapsed ? <ChevronRight size={16} strokeWidth={1.75} /> : <ChevronLeft size={16} strokeWidth={1.75} />}
              <span className="panel-footer-btn-text">{isCollapsed ? "Mở rộng" : "Thu gọn"}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
