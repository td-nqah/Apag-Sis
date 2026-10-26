// ==========================================================================
// APAG Admin System Configuration & Audit Trail Component (React + TypeScript)
// Exact 1:1 Restoration matching pages/admin/system.html & js/admin/system.js
// ==========================================================================

import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Key, 
  Check 
} from 'lucide-react';
import { Utils } from '../../utils/utils';

export const AdminSystem: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Chưa đổi');

  const handleTestBackend = () => {
    Utils.showToast('Đang kiểm tra kết nối tới dịch vụ cơ sở dữ liệu...', 'info');
    setTimeout(() => {
      Utils.showToast('Frontend Demo đang sử dụng Mock Data chuẩn sẵn sàng kết nối API Backend.', 'success');
    }, 600);
  };

  const handleBackupData = () => {
    Utils.showToast('Đang xuất tệp sao lưu dữ liệu JSON toàn hệ thống...', 'info');
    setTimeout(() => {
      Utils.showToast('Đã tải xuống bản sao lưu apag-backup-latest.json!', 'success');
    }, 500);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      Utils.showToast('Mật khẩu mới phải có ít nhất 6 ký tự!', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      Utils.showToast('Mật khẩu xác nhận không khớp!', 'warning');
      return;
    }
    const today = new Date().toLocaleDateString('vi-VN');
    setLastUpdated(today);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    Utils.showToast('Đã cập nhật mật khẩu quản trị viên thành công!', 'success');
  };

  const handleResetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Password strength logic
  const isLengthValid = newPassword.length >= 6;
  const isMatchValid = newPassword.length > 0 && newPassword === confirmPassword;
  let strengthLabel = 'Chưa nhập';
  let strengthPercent = 0;
  let strengthColor = 'var(--text-muted, #94A3B8)';

  if (newPassword.length > 0) {
    if (newPassword.length < 6) {
      strengthLabel = 'Yếu';
      strengthPercent = 30;
      strengthColor = 'var(--danger, #B91C1C)';
    } else if (newPassword.length < 10) {
      strengthLabel = 'Trung bình';
      strengthPercent = 65;
      strengthColor = 'var(--warning, #B45309)';
    } else {
      strengthLabel = 'Mạnh';
      strengthPercent = 100;
      strengthColor = 'var(--success, #047857)';
    }
  }

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      <div className="space-y-6">
        {/* Backend API Integration Status */}
        <div className="minimal-card p-6">
          <h2 className="text-base font-bold mb-3">Tích hợp Cơ sở dữ liệu & API Backend</h2>
          <p className="text-xs text-muted mb-4">
            Hệ thống hỗ trợ chuyển đổi linh hoạt giữa Mock Data và REST / GraphQL API chỉ với cấu hình trong <code>.env</code> / <code>src/services/</code>.
          </p>
          
          <div className="d-flex items-center justify-between p-3 bg-subtle rounded border mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="font-bold text-sm">Chế độ hoạt động hiện tại:</div>
              <div className="text-xs text-muted">DATA_SOURCE = 'mock' (Sẵn sàng kết nối Backend)</div>
            </div>
            <span className="badge badge-primary">Chế độ Demo / Mock</span>
          </div>

          <div className="d-flex gap-2" style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleTestBackend}>
              <Database size={14} />
              <span>Kiểm tra kết nối API Backend</span>
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={handleBackupData}>
              <Download size={14} />
              <span>Tải bản sao lưu JSON toàn hệ thống</span>
            </button>
          </div>
        </div>

        {/* Card: Bảo mật tài khoản Quản trị & Đổi mật khẩu */}
        <div className="minimal-card settings-card" style={{ marginBottom: '24px' }}>
          <div className="card-header d-flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="d-flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="metric-icon" style={{ color: 'var(--success, #047857)' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="card-title text-base font-bold">Bảo mật tài khoản Quản trị & Đổi mật khẩu</h2>
              </div>
            </div>
            <span className="badge badge-outline text-xs">Cập nhật lần cuối: {lastUpdated}</span>
          </div>
          <div className="card-body">
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="form-group mb-3">
                <label className="form-label text-sm font-semibold text-main">Mật khẩu hiện tại <span className="text-danger">*</span></label>
                <div className="input-with-icon" style={{ position: 'relative' }}>
                  <input 
                    type={showCurrent ? 'text' : 'password'} 
                    className="form-control" 
                    placeholder="Nhập mật khẩu hiện tại" 
                    required 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password" 
                    style={{ paddingRight: '40px' }}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowCurrent(!showCurrent)}
                    title="Hiển thị/Ẩn mật khẩu" 
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', display: 'flex', alignItems: 'center' }}
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label text-sm font-semibold text-main">Mật khẩu mới <span className="text-danger">*</span></label>
                  <div className="input-with-icon" style={{ position: 'relative' }}>
                    <input 
                      type={showNew ? 'text' : 'password'} 
                      className="form-control" 
                      placeholder="Tối thiểu 6 ký tự" 
                      required 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password" 
                      style={{ paddingRight: '40px' }}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowNew(!showNew)}
                      title="Hiển thị/Ẩn mật khẩu" 
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', display: 'flex', alignItems: 'center' }}
                    >
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label text-sm font-semibold text-main">Xác nhận mật khẩu mới <span className="text-danger">*</span></label>
                  <div className="input-with-icon" style={{ position: 'relative' }}>
                    <input 
                      type={showConfirm ? 'text' : 'password'} 
                      className="form-control" 
                      placeholder="Nhập lại mật khẩu mới" 
                      required 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password" 
                      style={{ paddingRight: '40px' }}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirm(!showConfirm)}
                      title="Hiển thị/Ẩn mật khẩu" 
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', display: 'flex', alignItems: 'center' }}
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Strength & Criteria Hint */}
              <div className="p-3 rounded border text-xs mb-3" style={{ background: 'var(--surface-subtle)', borderColor: 'var(--border)' }}>
                <div className="d-flex justify-between items-center mb-1.5" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="font-semibold text-main">Độ mạnh mật khẩu:</span>
                  <span className="font-bold" style={{ color: strengthColor }}>{strengthLabel}</span>
                </div>
                <div className="progress-bar-flat mb-2" style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${strengthPercent}%`, height: '100%', transformOrigin: 'left', transition: 'transform 0.3s, background-color 0.3s', backgroundColor: strengthColor }}></div>
                </div>
                <div className="d-flex items-center gap-3 text-muted flex-wrap" style={{ display: 'flex', gap: '16px' }}>
                  <span style={{ color: isLengthValid ? 'var(--success, #047857)' : 'inherit', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={12} /> Tối thiểu 6 ký tự
                  </span>
                  <span style={{ color: isMatchValid ? 'var(--success, #047857)' : 'inherit', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={12} /> Mật khẩu xác nhận trùng khớp
                  </span>
                </div>
              </div>

              <div className="d-flex justify-end gap-2 pt-2" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={handleResetForm}>
                  <RotateCcw size={14} />
                  <span>Nhập lại</span>
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Key size={14} />
                  <span>Cập nhật mật khẩu</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="minimal-card">
          <div className="card-header">
            <h2 className="card-title">Nhật ký truy vết bảo mật</h2>
          </div>
          <div className="card-body p-0">
            <table className="minimal-table">
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Tài khoản</th>
                  <th>Hành động</th>
                  <th>Địa chỉ IP</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-xs text-muted">2024-10-02 20:01</td>
                  <td><code>admin</code></td>
                  <td>Đăng nhập thành công</td>
                  <td><code>192.168.1.100</code></td>
                </tr>
                <tr>
                  <td className="text-xs text-muted">2024-10-02 19:45</td>
                  <td><code>advisor</code></td>
                  <td>Phê duyệt lộ trình REQ-1024</td>
                  <td><code>192.168.1.105</code></td>
                </tr>
                <tr>
                  <td className="text-xs text-muted">2024-10-02 18:30</td>
                  <td><code>student</code></td>
                  <td>Truy vấn AI Academic Advisor</td>
                  <td><code>192.168.1.120</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
