// ==========================================================================
// APAG Top Navbar Component (Unified App Shell - Height: 56px)
// Minimalist Design System: F-Shape start, Ctrl+K Command Bar, Essential Tools
// ==========================================================================

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Calendar, 
  Bell, 
  User as UserIcon,
  Settings,
  KeyRound,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CommandBar } from '../common/CommandBar';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
  pageTitle?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onToggleMobileSidebar, 
  pageTitle = 'Tổng quan học tập',
  isCollapsed = false,
  onToggleCollapse
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setShowProfile(false);
    logout();
    navigate('/login');
  };

  // Global Ctrl + K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandBarOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: 'Cảnh báo: Khối tự chọn chưa đăng ký', time: '2 giờ trước', link: '/student/notifications', type: 'warning' },
    { id: 2, title: 'Kế hoạch học tập HK2 2024-2025', time: '1 ngày trước', link: '/student/notifications', type: 'normal' },
    { id: 3, title: 'Đã có điểm thi kết thúc học phần', time: '3 ngày trước', link: '/student/notifications', type: 'normal' },
    { id: 4, title: 'Cố vấn học tập nhắc nhở nộp kế hoạch', time: '4 ngày trước', link: '/student/notifications', type: 'reminder' }
  ];

  return (
    <>
      <header className="navbar" id="appNavbar" style={{ height: '56px', minHeight: '56px' }}>
        {/* Left: Mobile Toggle, Desktop Collapse/Expand Toggle & Page Title (F-Shape Entry) */}
        <div className="navbar-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            type="button" 
            className="navbar-mobile-toggle" 
            onClick={onToggleMobileSidebar} 
            aria-label="Mở menu"
          >
            <Menu size={18} style={{ display: 'block', margin: 'auto' }} />
          </button>

          {onToggleCollapse && (
            <button 
              type="button" 
              className="navbar-sidebar-toggle" 
              onClick={onToggleCollapse} 
              title={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"} 
              aria-label={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
            >
              <Menu size={16} style={{ display: 'block', margin: 'auto' }} />
            </button>
          )}

          <div className="navbar-breadcrumb" id="navbarBreadcrumb" style={{ display: 'flex', alignItems: 'center' }}>
            <span className="breadcrumb-current font-bold" id="pageTitleText" style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>
              {pageTitle}
            </span>
          </div>
        </div>

        {/* Center: Command Bar Quick Search Button (Ctrl + K) */}
        <div 
          className="navbar-center"
        >
          <button 
            type="button"
            className="navbar-search-btn"
            onClick={() => setIsCommandBarOpen(true)}
            title="Tìm kiếm nhanh (Ctrl + K)"
            aria-label="Tìm kiếm nhanh học phần, sinh viên, quy chế (Ctrl + K)"
          >
            <div className="navbar-search-inner">
              <Search size={15} style={{ color: 'var(--text-secondary, #475569)', flexShrink: 0 }} />
              <span className="navbar-search-text">Tìm kiếm học phần, sinh viên, quy chế...</span>
            </div>
            <kbd className="navbar-search-kbd">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Right Utilities: Language, Theme, Notification, User Avatar */}
        <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

          {/* Notification Bell */}
          <div className="navbar-dropdown-wrapper" ref={notifRef}>
            <button 
              type="button" 
              className="navbar-icon-btn" 
              onClick={() => setShowNotif(!showNotif)}
              title="Thông báo học vụ" 
              aria-label="Xem thông báo"
              style={{ position: 'relative' }}
            >
              <Bell size={16} />
              <span 
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '7px',
                  height: '7px',
                  backgroundColor: 'var(--danger, #B91C1C)',
                  borderRadius: '50%',
                  border: '1.5px solid var(--surface)'
                }}
              ></span>
            </button>

            {showNotif && (
              <div className="navbar-dropdown" style={{ display: 'block', right: 0, width: '300px' }}>
                <div className="dropdown-header d-flex justify-between items-center" style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
                  <span className="font-semibold text-xs text-primary">Thông báo học vụ ({notifications.length})</span>
                  <Link 
                    to={user?.role === 'advisor' ? '/advisor/reports' : '/student/alerts'} 
                    className="text-xs text-primary" 
                    onClick={() => setShowNotif(false)}
                  >
                    Xem tất cả
                  </Link>
                </div>
                <div className="dropdown-list" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                  {notifications.map(n => (
                    <Link 
                      key={n.id} 
                      to={n.link} 
                      className="dropdown-item" 
                      onClick={() => setShowNotif(false)}
                      style={{ padding: '8px 12px', borderBottom: '1px solid var(--surface-subtle)' }}
                    >
                      <div className="d-flex items-start gap-2">
                        <span 
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: n.type === 'warning' ? '#EF4444' : n.type === 'reminder' ? '#F59E0B' : '#2563EB',
                            marginTop: '5px',
                            flexShrink: 0
                          }}
                        ></span>
                        <div>
                          <div className="dropdown-title font-medium text-xs text-main">{n.title}</div>
                          <div className="dropdown-time text-xs text-muted mt-0.5">{n.time}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar & Dropdown */}
          <div className="navbar-dropdown-wrapper" ref={profileRef}>
            <button 
              type="button" 
              className="btn btn-ghost btn-sm" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '4px 10px 4px 5px', 
                borderRadius: '999px',
                backgroundColor: '#F4F7FB',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                boxShadow: '-1.5px -1.5px 3.5px rgba(255, 255, 255, 0.95), 1.5px 1.5px 3.5px rgba(166, 178, 198, 0.3)'
              }}
              onClick={() => setShowProfile(!showProfile)}
            >
              <img 
                src={user?.avatar || "/assets/images/default-avatar.png"} 
                alt="Avatar" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/default-avatar.png';
                }}
                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255, 255, 255, 0.9)' }} 
              />
              <span className="font-semibold text-xs text-primary d-none d-lg-inline">
                {user?.fullName || user?.name || user?.username}
              </span>
            </button>

            {showProfile && (
              <div className="navbar-dropdown" style={{ display: 'block', minWidth: '200px', right: 0 }}>
                <div className="dropdown-header" style={{ padding: '12px', borderBottom: '1px solid var(--border)' }}>
                  <div className="font-semibold text-xs text-primary">{user?.fullName || user?.name}</div>
                  <div className="text-xs text-muted mt-0.5">
                    {user?.role === 'student' ? 'Sinh viên K25 • HTTT' : user?.role === 'advisor' ? 'Cố vấn học tập' : 'Quản lý đào tạo'}
                  </div>
                </div>
                <div className="dropdown-list" style={{ padding: '4px' }}>
                  <Link 
                    to={user?.role === 'student' ? '/student/profile' : user?.role === 'advisor' ? '/advisor/settings' : '/admin/settings'} 
                    className="dropdown-item" 
                    onClick={() => setShowProfile(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '0.8125rem' }}
                  >
                    <UserIcon size={14} />
                    <span>Hồ sơ cá nhân</span>
                  </Link>
                  <Link 
                    to={user?.role === 'student' ? '/student/settings' : user?.role === 'advisor' ? '/advisor/settings' : '/admin/settings'} 
                    className="dropdown-item" 
                    onClick={() => setShowProfile(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '0.8125rem' }}
                  >
                    <KeyRound size={14} />
                    <span>Đổi mật khẩu</span>
                  </Link>
                  <Link 
                    to={user?.role === 'student' ? '/student/settings' : user?.role === 'advisor' ? '/advisor/settings' : '/admin/settings'} 
                    className="dropdown-item" 
                    onClick={() => setShowProfile(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '0.8125rem' }}
                  >
                    <Settings size={14} />
                    <span>Cài đặt hệ thống</span>
                  </Link>

                  <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '4px 0' }} />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="dropdown-item"
                    style={{ 
                      width: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      padding: '8px 12px', 
                      fontSize: '0.8125rem',
                      color: 'var(--danger)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      borderRadius: '6px'
                    }}
                  >
                    <LogOut size={14} />
                    <span style={{ fontWeight: 600 }}>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Command Bar Dialog (Ctrl + K) */}
      <CommandBar 
        isOpen={isCommandBarOpen} 
        onClose={() => setIsCommandBarOpen(false)} 
      />
    </>
  );
};
