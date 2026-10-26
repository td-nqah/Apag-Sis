// ==========================================================================
// APAG SIS - Global Command Bar (Ctrl + K)
// Instant search across Courses, Students, Regulations & Quick Navigation
// ==========================================================================

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  BookOpen, 
  User, 
  FileText, 
  Compass, 
  Award, 
  AlertTriangle, 
  Sparkles, 
  Settings, 
  X, 
  ArrowRight,
  CornerDownLeft,
  LucideIcon
} from 'lucide-react';

interface CommandItem {
  id: string;
  category: 'course' | 'student' | 'regulation' | 'action';
  title: string;
  subtitle: string;
  badge?: string;
  link: string;
  icon: LucideIcon;
}

interface CommandBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandBar: React.FC<CommandBarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandItems: CommandItem[] = [
    // Navigation / Actions
    { id: 'act-1', category: 'action', title: 'Tổng quan học tập (Dashboard)', subtitle: 'Xem 3 thẻ chỉ số học tập cốt lõi & học phần đang học', link: '/student/dashboard', icon: Award },
    { id: 'act-2', category: 'action', title: 'Kết quả & Tiến độ tích lũy', subtitle: 'Bảng điểm 4 học kỳ và 130 tín chỉ tốt nghiệp', link: '/student/grades', icon: Award },
    { id: 'act-3', category: 'action', title: 'Lộ trình & Khung chương trình đào tạo', subtitle: 'Sơ đồ cây học phần và học phần tiên quyết', link: '/student/learning-path', icon: Compass },
    { id: 'act-4', category: 'action', title: 'Đơn từ & Cảnh báo học vụ', subtitle: 'Gửi yêu cầu học vụ tới Cố vấn học tập', link: '/student/alerts', icon: AlertTriangle },
    { id: 'act-5', category: 'action', title: 'Trợ lý học thuật AI (RAG 2.1)', subtitle: 'Tra cứu quy chế đào tạo và gợi ý học kỳ tới', link: '/student/ai-assistant', icon: Sparkles },
    { id: 'act-6', category: 'action', title: 'Cài đặt hệ thống & Tài khoản', subtitle: 'Đổi mật khẩu và quản lý thông báo học vụ', link: '/student/settings', icon: Settings },

    // Courses
    { id: 'crs-1', category: 'course', title: 'LIF2003 - Phân tích & Thiết kế HTTT', subtitle: '3 Tín chỉ • TS. Nguyễn Năng Thành • Đang học', badge: 'Học phần', link: '/student/grades', icon: BookOpen },
    { id: 'crs-2', category: 'course', title: 'LIF2113 - Mạng máy tính', subtitle: '3 Tín chỉ • ThS. Nguyễn Văn Bình • Đang học', badge: 'Học phần', link: '/student/grades', icon: BookOpen },
    { id: 'crs-3', category: 'course', title: 'LIF2020 - Lập trình Web', subtitle: '3 Tín chỉ • TS. Vũ Minh Tuấn • Đang học', badge: 'Học phần', link: '/student/grades', icon: BookOpen },
    { id: 'crs-4', category: 'course', title: 'ISF325-2007 - Công nghệ phần mềm', subtitle: '3 Tín chỉ • ThS. Lê Hoàng Long • Đang học', badge: 'Học phần', link: '/student/grades', icon: BookOpen },
    { id: 'crs-5', category: 'course', title: 'LIF2004 - Hệ quản trị cơ sở dữ liệu', subtitle: '3 Tín chỉ • Tiên quyết cho Khai phá dữ liệu', badge: 'Tiên quyết', link: '/student/learning-path', icon: BookOpen },

    // Students
    { id: 'std-1', category: 'student', title: 'Trần Mạnh Hà (2505HTTB012)', subtitle: 'Ngành HTTT • Lớp 25HTTB01 • GPA 3.24', badge: 'Sinh viên', link: '/student/profile', icon: User },
    { id: 'std-2', category: 'student', title: 'Nguyễn Văn An (2505HTTB001)', subtitle: 'Ngành HTTT • Lớp 25HTTB01 • GPA 3.65', badge: 'Sinh viên', link: '/advisor/students', icon: User },
    { id: 'std-3', category: 'student', title: 'Lê Thị Mai (2505HTTB002)', subtitle: 'Ngành HTTT • Lớp 25HTTB01 • GPA 2.45 (Cần chú ý)', badge: 'Cảnh báo', link: '/advisor/students', icon: User },
    { id: 'std-4', category: 'student', title: 'Hoàng Quốc Bảo (2505HTTB003)', subtitle: 'Ngành HTTT • Lớp 25HTTB01 • GPA 1.45 (Nguy cơ)', badge: 'Nguy cơ đỏ', link: '/advisor/students', icon: User },

    // Regulations / Knowledge Base
    { id: 'reg-1', category: 'regulation', title: 'QĐ 458/QĐ-HVHC - Quy chế đào tạo tín chỉ', subtitle: 'Quy định về thang điểm 4.0, điều kiện tốt nghiệp & cảnh báo học vụ', badge: 'Quy chế', link: '/admin/regulations', icon: FileText },
    { id: 'reg-2', category: 'regulation', title: 'QĐ 120/QĐ-HVHC - Chuẩn đầu ra Ngoại ngữ B1', subtitle: 'Yêu cầu nộp chứng chỉ VSTEP B1 hoặc IELTS >= 4.5 trước HK7', badge: 'Chuẩn ĐR', link: '/admin/regulations', icon: FileText },
    { id: 'reg-3', category: 'regulation', title: 'QĐ 302/QĐ-HVHC - Học bổng khuyến khích học tập', subtitle: 'Tiêu chuẩn xét học bổng Khá, Giỏi, Xuất sắc theo học kỳ', badge: 'Học bổng', link: '/admin/knowledge-base', icon: FileText },

    // Instant Slash Commands
    { id: 'slash-1', category: 'action', title: '/gpa - Mô phỏng điểm & CPA mục tiêu', subtitle: 'Mở công cụ What-If GPA Simulator và bảng điểm', badge: 'Lệnh /gpa', link: '/student/dashboard', icon: Award },
    { id: 'slash-2', category: 'action', title: '/canh-bao - Xem radar sinh viên nguy cơ', subtitle: 'Chuyển nhanh tới trang cảnh báo học vụ & rủi ro', badge: 'Lệnh /canh-bao', link: '/advisor/alerts', icon: AlertTriangle },
    { id: 'slash-3', category: 'action', title: '/hoi-ai - Trợ lý học thuật AI (RAG 2.1)', subtitle: 'Kích hoạt khu vực tư vấn học vụ bằng Trợ lý học thuật AI', badge: 'Lệnh /hoi-ai', link: '#ai-drawer', icon: Sparkles },
    { id: 'slash-4', category: 'action', title: '/tree - Sơ đồ Cây học phần & Tiên quyết', subtitle: 'Xem mạng lưới học phần tiên quyết và lộ trình tích lũy', badge: 'Lệnh /tree', link: '/student/learning-path', icon: Compass },
    { id: 'slash-5', category: 'action', title: '/xuat-excel - Xuất dữ liệu bảng điểm / tác vụ', subtitle: 'Tải nhanh file báo cáo thống kê định dạng .xlsx', badge: 'Lệnh /xuat-excel', link: '#export-excel', icon: FileText },
    { id: 'slash-6', category: 'action', title: '/gradebook - Sổ điểm thông minh & Phổ điểm Bell Curve', subtitle: 'Bàn làm việc giảng viên vào điểm trực tuyến', badge: 'Lệnh /gradebook', link: '/admin/dashboard', icon: BookOpen }
  ];

  const filteredItems = commandItems.filter(item => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    if (q.startsWith('/')) {
      return item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || (item.badge && item.badge.toLowerCase().includes(q));
    }
    return item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q);
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelectItem(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelectItem = (item: CommandItem) => {
    onClose();
    if (item.link === '#ai-drawer') {
      window.dispatchEvent(new CustomEvent('open-ai-drawer', { detail: {} }));
    } else if (item.link === '#export-excel') {
      navigate('/admin/dashboard');
    } else {
      navigate(item.link);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-backdrop active"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '640px',
          backgroundColor: 'rgba(245, 247, 251, 0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: 'var(--shadow-modal)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Search Input Bar */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '14px 16px',
            borderBottom: '1px solid var(--border)',
            gap: '12px'
          }}
        >
          <Search size={18} className="text-muted" />
          <input 
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tìm kiếm học phần, sinh viên, quy chế hoặc tính năng... (Ctrl + K)"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '0.9375rem',
              color: 'var(--text-primary)',
              fontWeight: 500
            }}
          />
          {query ? (
            <button 
              type="button" 
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
            >
              <X size={16} />
            </button>
          ) : (
            <kbd 
              style={{
                fontSize: '0.6875rem',
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'var(--surface-subtle)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                fontWeight: 600
              }}
            >
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '6px' }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Không tìm thấy kết quả nào phù hợp với "{query}"
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? 'var(--surface-subtle)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 100ms ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div 
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        backgroundColor: isSelected ? 'var(--primary)' : 'var(--surface-subtle)',
                        color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 100ms ease'
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div 
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {item.title}
                      </div>
                      <div 
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-secondary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
                    {item.badge && (
                      <span 
                        style={{
                          fontSize: '0.6875rem',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          backgroundColor: item.badge.includes('Nguy cơ') ? 'var(--danger-bg)' : item.badge.includes('Cảnh báo') ? 'var(--warning-bg)' : 'var(--surface-subtle)',
                          color: item.badge.includes('Nguy cơ') ? 'var(--danger)' : item.badge.includes('Cảnh báo') ? 'var(--warning)' : 'var(--text-secondary)',
                          fontWeight: 500,
                          border: `1px solid ${item.badge.includes('Nguy cơ') ? 'var(--danger-border)' : item.badge.includes('Cảnh báo') ? 'var(--warning-border)' : 'var(--border)'}`
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isSelected && (
                      <CornerDownLeft size={14} className="text-primary" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div 
          style={{
            padding: '8px 16px',
            borderTop: '1px solid var(--border)',
            backgroundColor: 'var(--surface-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', gap: '12px' }}>
            <span><kbd style={{ padding: '1px 4px', borderRadius: '3px', background: 'var(--surface)', border: '1px solid var(--border)' }}>↑↓</kbd> để di chuyển</span>
            <span><kbd style={{ padding: '1px 4px', borderRadius: '3px', background: 'var(--surface)', border: '1px solid var(--border)' }}>↵</kbd> để chọn</span>
            <span><kbd style={{ padding: '1px 4px', borderRadius: '3px', background: 'var(--surface)', border: '1px solid var(--border)' }}>ESC</kbd> để thoát</span>
          </div>
          <span style={{ fontWeight: 500, color: 'var(--primary)' }}>APAG SIS | Hệ thống cố vấn thông minh</span>
        </div>
      </div>
    </div>
  );
};
