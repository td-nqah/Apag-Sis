// ==========================================================================
// APAG Student Notifications Page Component (React + TypeScript)
// Phân loại trực quan: Bình thường (Xanh) - Nhắc nhở (Vàng) - Cảnh báo (Đỏ)
// ==========================================================================

import React, { useState } from 'react';
import { Bell, CheckCheck, AlertCircle, AlertTriangle, Info, Calendar } from 'lucide-react';
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

  const handleToggleRead = (id: number) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

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
          color: '#EF4444', // Màu đỏ
          accentBg: 'rgba(239, 68, 68, 0.08)',
          badgeBorder: 'rgba(239, 68, 68, 0.35)',
          badgeText: '#DC2626',
          cardBg: isRead ? 'var(--surface)' : 'rgba(239, 68, 68, 0.035)',
          borderColor: '#EF4444'
        };
      case 'reminder':
        return {
          label: 'Nhắc nhở',
          color: '#F59E0B', // Màu vàng
          accentBg: 'rgba(245, 158, 11, 0.12)',
          badgeBorder: 'rgba(245, 158, 11, 0.4)',
          badgeText: '#D97706',
          cardBg: isRead ? 'var(--surface)' : 'rgba(245, 158, 11, 0.035)',
          borderColor: '#F59E0B'
        };
      case 'normal':
      default:
        return {
          label: 'Bình thường',
          color: '#2563EB', // Màu xanh nước biển
          accentBg: 'rgba(37, 99, 235, 0.08)',
          badgeBorder: 'rgba(37, 99, 235, 0.3)',
          badgeText: '#2563EB',
          cardBg: isRead ? 'var(--surface)' : 'rgba(37, 99, 235, 0.025)',
          borderColor: '#2563EB'
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
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <span>Cảnh báo ({warningCount})</span>
            </button>

            <button 
              type="button" 
              className={`btn btn-sm ${filter === 'reminder' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('reminder')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <span>Nhắc nhở ({reminderCount})</span>
            </button>

            <button 
              type="button" 
              className={`btn btn-sm ${filter === 'normal' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('normal')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563EB' }} />
              <span>Bình thường ({normalCount})</span>
            </button>
          </div>

          <button type="button" className="btn btn-secondary btn-sm" onClick={handleMarkAllRead}>
            <CheckCheck size={14} />
            <span>Đánh dấu đã đọc tất cả</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredNotifs.map(n => {
          const meta = getNotifMeta(n.type, n.read);

          return (
            <div 
              key={n.id}
              className="minimal-card p-4"
              onClick={() => handleToggleRead(n.id)}
              style={{ 
                padding: '16px 20px', 
                cursor: 'pointer',
                backgroundColor: meta.cardBg,
                // Thông báo bình thường: xanh nước biển; nhắc nhở: vàng; cảnh báo: đỏ
                borderLeft: !n.read 
                  ? `4px solid ${meta.borderColor}` 
                  : '1px solid var(--border)',
                transition: 'all 150ms ease-out'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {/* Badge danh mục theo mã màu tương ứng */}
                  <span 
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      backgroundColor: meta.accentBg,
                      color: meta.badgeText,
                      border: `1px solid ${meta.badgeBorder}`,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {n.category}
                  </span>

                  <h3 
                    style={{
                      fontSize: '0.875rem',
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
                          width: '7px',
                          height: '7px',
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

                <span className="text-xs text-muted" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {n.time}
                </span>
              </div>

              <p 
                style={{ 
                  fontSize: '0.8125rem', 
                  color: 'var(--text-secondary)', 
                  margin: '4px 0 0 0',
                  lineHeight: 1.5 
                }}
              >
                {n.content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
