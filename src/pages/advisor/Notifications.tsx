// ==========================================================================
// APAG Advisor Notifications Page Component (React + TypeScript)
// ==========================================================================

import React, { useState } from 'react';
import { Send, CheckCircle2, Bell, Users } from 'lucide-react';
import { Utils } from '../../utils/utils';

export const AdvisorNotifications: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetClass, setTargetClass] = useState('2505HTTB');
  const [isSending, setIsSending] = useState(false);

  const [history, setHistory] = useState([
    {
      id: 1,
      title: 'Nhắc nhở nộp danh sách đơn vị thực tập tốt nghiệp',
      class: '2505HTTB',
      date: '08/10/2026',
      recipients: 44
    },
    {
      id: 2,
      title: 'Họp lớp sinh hoạt cố vấn định kỳ giữa kỳ 1',
      class: '2505HTTB',
      date: '20/09/2026',
      recipients: 44
    }
  ]);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      const item = {
        id: Date.now(),
        title: title.trim(),
        class: targetClass,
        date: new Date().toLocaleDateString('vi-VN'),
        recipients: 44
      };
      setHistory([item, ...history]);
      setTitle('');
      setContent('');
      setIsSending(false);
      Utils.showToast('Đã phát thông báo thành công đến toàn thể sinh viên trong lớp!', 'success');
    }, 400);
  };

  return (
    <div>
      <div className="dashboard-grid" style={{ alignItems: 'stretch' }}>
        {/* Left: Compose Form */}
        <div className="grid-col-left" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="minimal-card mb-6" style={{ height: '100%', marginBottom: 0 }}>
            <div className="card-header">
              <h2 className="card-title">1. Soạn thảo thông báo mới</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSendBroadcast}>
                <div className="form-group mb-3">
                  <label className="form-label text-xs font-semibold">Gửi tới lớp:</label>
                  <select 
                    className="form-control"
                    value={targetClass}
                    onChange={(e) => setTargetClass(e.target.value)}
                  >
                    <option value="2505HTTB">Lớp 2505HTTB (44 Sinh viên)</option>
                    <option value="all">Tất cả sinh viên quản lý</option>
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label text-xs font-semibold">Tiêu đề thông báo:</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Nhập tiêu đề thông báo..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="form-label text-xs font-semibold">Nội dung chi tiết:</label>
                  <textarea 
                    className="form-control" 
                    rows={5}
                    placeholder="Nhập nội dung nhắc nhở hoặc thông báo học vụ..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-full" disabled={isSending} style={{ width: '100%', justifyContent: 'center' }}>
                  <Send size={16} />
                  <span>{isSending ? 'Đang phát thông báo...' : 'Phát thông báo đến lớp'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right: History */}
        <div className="grid-col-right" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="minimal-card mb-6" style={{ height: '100%', marginBottom: 0 }}>
            <div className="card-header">
              <h2 className="card-title">2. Lịch sử thông báo đã phát</h2>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="minimal-table">
                  <thead>
                    <tr>
                      <th>Tiêu đề thông báo</th>
                      <th>Lớp</th>
                      <th>Ngày gửi</th>
                      <th style={{ textAlign: 'right' }}>Đã gửi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(h => (
                      <tr key={h.id}>
                        <td className="font-semibold text-main">{h.title}</td>
                        <td><code>{h.class}</code></td>
                        <td className="text-xs text-muted">{h.date}</td>
                        <td style={{ textAlign: 'right' }}>
                          <span className="badge badge-success">{h.recipients} SV</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
