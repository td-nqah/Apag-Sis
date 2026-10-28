// ==========================================================================
// APAG Student Notifications Page Component (React + TypeScript)
// Phân loại trực quan: Bình thường (Xanh) - Nhắc nhở (Vàng) - Cảnh báo (Đỏ)
// ==========================================================================

import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, AlertCircle, AlertTriangle, Info, Calendar, Eye, X, Clock, Building2 } from 'lucide-react';
import { Utils } from '../../utils/utils';

export type NotifType = 'normal' | 'reminder' | 'warning';

interface Notif {
  id: number;
  title: string;
  category: string;
  type: NotifType;
  time: string;
  content: string;
  read: boolean;
}

export const StudentNotifications: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [selectedNotif, setSelectedNotif] = useState<Notif | null>(null);
  const [notifs, setNotifs] = useState<Notif[]>([
    {
      id: 1,
      title: 'Thông báo kế hoạch học tập Học kỳ 2 năm học 2024 - 2025',
      category: 'Đào tạo',
      type: 'normal',
      time: '10/10/2026 09:30',
      content: 'Hệ thống quy hoạch kế hoạch học tập sẽ mở đợt 1 từ 08h00 ngày 20/10/2026 đến 17h00 ngày 25/10/2026. Sinh viên cần chủ động rà soát điều kiện tiên quyết.',
      read: false
    },
    {
      id: 2,
      title: 'Cố vấn học tập nhắc nhở rà soát hồ sơ thực tập tốt nghiệp',
      category: 'Cố vấn',
      type: 'reminder',
      time: '08/10/2026 14:15',
      content: 'TS. Nguyễn Năng Thành đã gửi thông báo yêu cầu sinh viên K25 nộp danh sách đơn vị thực tập dự kiến trước ngày 15/11/2026.',
      read: false
    },
    {
      id: 3,
      title: 'Cảnh báo học vụ: Nguy cơ rơi vào cảnh báo học tập do tiến độ tích lũy dưới mức chuẩn',
      category: 'Cảnh báo',
      type: 'warning',
      time: '05/10/2026 08:30',
      content: 'Theo Điều 24 Quy chế Đào tạo QĐ 458/QĐ-HVHC, sinh viên cần tích lũy tối thiểu 14 tín chỉ trong học kỳ chính để không rơi vào diện cảnh báo học tập mức 1.',
      read: false
    },
    {
      id: 4,
      title: 'Đã công bố điểm thi kết thúc học phần CNTT201 (Cơ sở dữ liệu)',
      category: 'Khảo thí',
      type: 'normal',
      time: '01/10/2026 16:45',
      content: 'Điểm tổng kết học phần CNTT201 của bạn đã được công bố trên hệ thống: Điểm tổng kết 8.2 (Điểm B+).',
      read: true
    },
    {
      id: 5,
      title: 'Nhắc nhở nộp chứng chỉ Ngoại ngữ chuẩn đầu ra B1 đợt xét tốt nghiệp sớm',
      category: 'Nhắc nhở',
      type: 'reminder',
      time: '28/09/2026 11:20',
      content: 'Thời hạn nộp chứng chỉ Tiếng Anh B1 hoặc tương đương đợt 1 năm học 2024-2025 kết thúc vào ngày 15/10/2026.',
      read: true
    },
    {
      id: 6,
      title: 'Thông báo xét cấp học bổng khuyến khích học tập kỳ 1 2024 - 2025',
      category: 'Công tác SV',
      type: 'normal',
      time: '25/09/2026 10:00',
      content: 'Phòng Quản lý Đào tạo và Công tác Sinh viên thông báo danh sách sinh viên đủ điều kiện xét học bổng khuyến khích học tập.',
      read: true
    }
  ]);

  const handleMarkAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    Utils.showToast('Đã đánh dấu đọc toàn bộ thông báo', 'success');
  };

  const handleOpenDetail = (notif: Notif) => {
    setSelectedNotif(notif);
    if (!notif.read) {
      setNotifs(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedNotif(null);
      }
    };
    if (selectedNotif) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNotif]);

  const filteredNotifs = notifs.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'normal') return n.type === 'normal';
    if (filter === 'reminder') return n.type === 'reminder';
    if (filter === 'warning') return n.type === 'warning';
    return true;
  });

  const getNotifMeta = (type: NotifType, isRead: boolean) => {
    switch (type) {
      case 'warning':
        return {
          label: 'Cảnh báo',
          color: 'var(--danger, #B91C1C)',
          accentBg: 'var(--danger-bg, #FEF2F2)',
          badgeBorder: 'var(--danger-border, #FECACA)',
          badgeText: 'var(--danger-text, #7F1D1D)',
          cardBg: isRead ? 'var(--surface)' : 'rgba(185, 28, 28, 0.04)',
          borderColor: 'var(--danger, #B91C1C)'
        };
      case 'reminder':
        return {
          label: 'Nhắc nhở',
          color: 'var(--warning, #B45309)',
          accentBg: 'var(--warning-bg, #FFFBEB)',
          badgeBorder: 'var(--warning-border, #FDE68A)',
          badgeText: 'var(--warning-text, #78350F)',
          cardBg: isRead ? 'var(--surface)' : 'rgba(180, 83, 9, 0.04)',
          borderColor: 'var(--warning, #B45309)'
        };
      case 'normal':
      default:
        return {
          label: 'Bình thường',
          color: 'var(--primary, #1D4ED8)',
          accentBg: 'var(--primary-light, #EFF6FF)',
          badgeBorder: 'var(--primary-border, #BFDBFE)',
          badgeText: 'var(--primary, #1D4ED8)',
          cardBg: isRead ? 'var(--surface)' : 'rgba(29, 78, 216, 0.03)',
          borderColor: 'var(--primary, #1D4ED8)'
        };
    }
  };

  const unreadCount = notifs.filter(n => !n.read).length;
  const warningCount = notifs.filter(n => n.type === 'warning').length;
  const reminderCount = notifs.filter(n => n.type === 'reminder').length;
  const normalCount = notifs.filter(n => n.type === 'normal').length;

  return (
    <div>
      {/* Filter Tabs & Quick Action */}
      <div className="minimal-card mb-6 p-4" style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button 
              type="button" 
              className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('all')}
            >
              Tất cả ({notifs.length})
            </button>
            <button 
              type="button" 
              className={`btn btn-sm ${filter === 'unread' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('unread')}
            >
              Chưa đọc ({unreadCount})
            </button>

            {/* Phân loại theo màu sắc yêu cầu */}
            <button 
              type="button" 
              className={`btn btn-sm ${filter === 'warning' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('warning')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--danger, #B91C1C)' }} />
              <span>Cảnh báo ({warningCount})</span>
            </button>

            <button 
              type="button" 
              className={`btn btn-sm ${filter === 'reminder' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('reminder')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--warning, #B45309)' }} />
              <span>Nhắc nhở ({reminderCount})</span>
            </button>

            <button 
              type="button" 
              className={`btn btn-sm ${filter === 'normal' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('normal')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary, #1D4ED8)' }} />
              <span>Bình thường ({normalCount})</span>
            </button>
          </div>

          <button type="button" className="btn btn-secondary btn-sm" onClick={handleMarkAllRead} style={{ fontSize: '0.875rem' }}>
            <CheckCheck size={14} />
            <span>Đánh dấu đã đọc tất cả</span>
          </button>
        </div>
      </div>

      {/* Notifications List - Compact Title Only + View Detail Action */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredNotifs.map(n => {
          const meta = getNotifMeta(n.type, n.read);

          return (
            <div 
              key={n.id}
              className="minimal-card"
              onClick={() => handleOpenDetail(n)}
              style={{ 
                padding: '14px 20px', 
                cursor: 'pointer',
                backgroundColor: meta.cardBg,
                border: !n.read ? `1px solid ${meta.borderColor}` : '1px solid var(--border)',
                transition: 'border-color var(--transition-fast), background-color var(--transition-fast), transform var(--transition-fast)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              {/* Left: Badge + Unread Indicator Dot + Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 500px', minWidth: '280px' }}>
                <span 
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    backgroundColor: meta.accentBg,
                    color: meta.badgeText,
                    border: `1px solid ${meta.badgeBorder}`,
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  {n.category}
                </span>

                <h3 
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: n.read ? 600 : 700,
                    color: 'var(--text-primary)',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {!n.read && (
                    <span 
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: meta.borderColor,
                        display: 'inline-block',
                        flexShrink: 0
                      }} 
                      title="Chưa đọc"
                    />
                  )}
                  <span>{n.title}</span>
                </h3>
              </div>

              {/* Right: Timestamp + Nút Xem chi tiết */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                <span className="text-xs text-muted" style={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                  {n.time}
                </span>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDetail(n);
                  }}
                  style={{
                    fontSize: '0.8125rem',
                    padding: '6px 14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Eye size={14} />
                  <span>Xem chi tiết</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Màn hình nhỏ (Modal) hiển thị toàn bộ nội dung thông báo */}
      {selectedNotif && (
        <div 
          className="modal-backdrop active"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedNotif(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modalNotifTitle"
            style={{
              width: '100%',
              maxWidth: '560px',
              backgroundColor: 'var(--surface, #FFFFFF)',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-modal)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '90vh'
            }}
          >
            {/* Modal Header */}
            <div 
              style={{ 
                padding: '18px 20px', 
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '12px',
                backgroundColor: 'var(--surface-subtle, #F8FAFC)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span 
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '2.5px 9px',
                      borderRadius: '999px',
                      backgroundColor: getNotifMeta(selectedNotif.type, selectedNotif.read).accentBg,
                      color: getNotifMeta(selectedNotif.type, selectedNotif.read).badgeText,
                      border: `1px solid ${getNotifMeta(selectedNotif.type, selectedNotif.read).badgeBorder}`
                    }}
                  >
                    {selectedNotif.category}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} />
                    {selectedNotif.time}
                  </span>
                </div>
                <h2 
                  id="modalNotifTitle"
                  style={{ 
                    fontSize: '1.0625rem', 
                    fontWeight: 700, 
                    color: 'var(--text-primary)', 
                    margin: 0,
                    lineHeight: 1.4
                  }}
                >
                  {selectedNotif.title}
                </h2>
              </div>
              
              <button
                type="button"
                onClick={() => setSelectedNotif(null)}
                aria-label="Đóng hộp thoại"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '8px',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content - Toàn bộ nội dung thông báo */}
            <div style={{ padding: '24px 20px', overflowY: 'auto' }}>
              <div 
                style={{
                  backgroundColor: 'var(--surface-nested, #F8FAFC)',
                  border: '1px solid var(--border-nested, #E2E8F0)',
                  borderRadius: '12px',
                  padding: '18px 20px',
                  marginBottom: '16px'
                }}
              >
                <p 
                  style={{ 
                    fontSize: '0.9375rem', 
                    color: 'var(--text-primary)', 
                    margin: 0,
                    lineHeight: 1.65,
                    textIndent: '1.27cm',
                    textAlign: 'left'
                  }}
                >
                  {selectedNotif.content}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                <Info size={14} style={{ flexShrink: 0 }} />
                <span>Thông báo chính thức từ Cổng thông tin Đào tạo & Quản lý Học vụ APAG SIS.</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div 
              style={{ 
                padding: '14px 20px', 
                borderTop: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                backgroundColor: 'var(--surface)'
              }}
            >
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={() => setSelectedNotif(null)}
                style={{ minWidth: '90px' }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
